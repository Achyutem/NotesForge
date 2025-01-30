import { NextResponse } from "next/server";
import { openDb } from "@/app/lib/sqliteConnect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Allowing CORS for local development
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
}

export async function POST(req: Request) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = await openDb();

    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email.toLowerCase(), hashedPassword]
    );

    if (!result.lastID) {
      throw new Error("Failed to insert user");
    }

    const newUser = await db.get("SELECT * FROM users WHERE id = ?", [
      result.lastID,
    ]);

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Registration successful",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      },
      { status: 201, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}