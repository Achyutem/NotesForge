/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import Papa from "papaparse";

const DB_FILE = "database.db";

// This function should get the ID of the currently authenticated user
// This is a placeholder for your actual authentication logic
function getCurrentUserId(request: Request): number | null {
	// Example: return request.auth.userId;
	// For now, we'll return 1 for the demo user.
	// In a real app, this MUST be implemented securely.
	return 1;
}

interface TodoFromCsv {
	title?: string;
	description?: string;
	tags?: string;
}

// The function now requires the authenticated userId
function insertTodos(userId: number, todos: TodoFromCsv[]): Promise<string> {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(DB_FILE, (err) => {
			if (err) reject(`Database connection error: ${err.message}`);
		});

		const query = `
            INSERT INTO todos (userId, title, description, tags, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

		db.serialize(() => {
			db.run("BEGIN TRANSACTION", (err) => {
				if (err) return reject(err);
			});

			const stmt = db.prepare(query);

			for (const todo of todos) {
				// Ensure tags are a valid JSON array string
				let tagsJson = "[]";
				try {
					// Check if the tags string is already a valid JSON array
					if (todo.tags && Array.isArray(JSON.parse(todo.tags))) {
						tagsJson = todo.tags;
					}
				} catch (e) {
					// If parsing fails, it's not a valid JSON array, keep it empty
				}

				// Use the authenticated userId, ignore any ID from the CSV
				stmt.run(
					userId,
					todo.title || "Untitled",
					todo.description || "",
					tagsJson
				);
			}

			stmt.finalize((err) => {
				if (err) return reject(err);

				db.run("COMMIT", (err) => {
					if (err) {
						db.run("ROLLBACK");
						return reject(`Transaction error: ${err.message}`);
					}
					resolve("Import successful");
				});
			});
		});

		db.close();
	});
}

export async function POST(request: Request): Promise<NextResponse> {
	const userId = getCurrentUserId(request);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const fileText = await file.text();
		const { data, errors } = Papa.parse<TodoFromCsv>(fileText.trim(), {
			header: true,
			skipEmptyLines: true,
			// Transform headers to simple lowercase to be more robust
			transformHeader: (header: string) => header.trim().toLowerCase(),
		});

		if (errors.length > 0) {
			console.error("CSV Parsing Errors:", errors);
			return NextResponse.json(
				{ error: "Invalid CSV format" },
				{ status: 400 }
			);
		}

		// Pass the authenticated userId to the insertion function
		await insertTodos(userId, data);
		return NextResponse.json(
			{ message: "Todos imported successfully" },
			{ status: 200 }
		);
	} catch (error: unknown) {
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to import todos",
			},
			{ status: 500 }
		);
	}
}
