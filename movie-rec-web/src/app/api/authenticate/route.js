import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { openDb } from '../../../../db/sqlite';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const db = await openDb();

    // Find the user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' });
    }

    return NextResponse.json({ success: true, message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error in login route:', error); // Log the full error
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}
