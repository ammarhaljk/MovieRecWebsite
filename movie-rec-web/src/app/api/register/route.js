import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { openDb } from '../../../../db/sqlite';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const db = await openDb();

    // Check if the email already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);

    return NextResponse.json({ success: true, message: 'Sign-up successful' });
  } catch (error) {
    console.error('Error in register route:', error); // Log the full error
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}
