import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import Papa from "papaparse";

const DB_FILE = "database.db";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCurrentUserId(request: Request): number | null {
	return 1;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function queryUserTodos(userId: number): Promise<any[]> {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(DB_FILE, (err) => {
			if (err) reject(`Database connection error: ${err.message}`);
		});

		// Query now filters by the provided userId
		const query = `
            SELECT id, userId, title, description, tags, createdAt
            FROM todos
            WHERE userId = ?
            ORDER BY createdAt DESC
        `;

		db.all(query, [userId], (err, todos) => {
			db.close();
			if (err) reject(`Query error: ${err.message}`);
			resolve(todos);
		});
	});
}

export async function GET(request: Request) {
	const userId = getCurrentUserId(request);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const todos = await queryUserTodos(userId);

		// Use PapaParse to correctly convert JSON to CSV, preventing data corruption
		const csvContent = Papa.unparse(todos, {
			header: true,
			columns: ["id", "userId", "title", "description", "tags", "createdAt"],
		});

		const filename = `notesforge_export_${
			new Date().toISOString().split("T")[0]
		}.csv`;

		return new NextResponse(csvContent, {
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="${filename}"`,
			},
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to export todos" },
			{ status: 500 }
		);
	}
}
