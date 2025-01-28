import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/sqliteConnect'; // Import SQLite connection
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const db = await openDb();

    // Check if the user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [
      email.toLowerCase(),
    ]);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email.toLowerCase(), hashedPassword]
    );

    // Fetch the newly created user
    const newUser = await db.get('SELECT * FROM users WHERE id = ?', [
      result.lastID,
    ]);

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser.id }, // Use newUser.id instead of newUser._id
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}