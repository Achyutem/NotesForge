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
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );

    const inactivityTimeout = 24 * 60 * 60;

    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: inactivityTimeout,
      // secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}