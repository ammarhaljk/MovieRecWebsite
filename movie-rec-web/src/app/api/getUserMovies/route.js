import { NextResponse } from 'next/server';
import { openDb } from '../../../../db/sqlite';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  try {
    const db = await openDb();

    // Fetch the user's ID using their email
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!user) {
      return NextResponse.json({ success: false, watchedMovies: [] });
    }

    // Fetch the list of watched movies for the user
    const watchedMovies = db
      .prepare('SELECT movie_title AS title, movie_id AS id FROM watched_movies WHERE user_id = ?')
      .all(user.id);

    return NextResponse.json({ success: true, watchedMovies });
  } catch (error) {
    console.error('Error in getUserMovies route:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}
