import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/sqliteConnect'; // Import SQLite connection
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const db = await openDb();

    // Find the user by email
    const user = await db.get('SELECT * FROM users WHERE email = ?', [
      email.toLowerCase(),
    ]);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare the password with the hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id }, // Use user.id instead of user._id
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    // Set the token in a cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
    });

    response.cookies.set('auth-token', token, {
      path: '/',
      maxAge: 86400 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}