import { NextResponse } from 'next/server';
import { openDb } from '../../../../db/sqlite';

export async function POST(req) {
  try {
    const { email, movieId } = await req.json();
    const db = await openDb();

    // Get the user's ID using their email
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    // Remove the movie from the watched list
    db.prepare('DELETE FROM watched_movies WHERE user_id = ? AND movie_id = ?').run(user.id, movieId);

    // Fetch the updated list of watched movies
    const updatedWatchedMovies = db
      .prepare('SELECT movie_title AS title, movie_id AS id FROM watched_movies WHERE user_id = ?')
      .all(user.id);

    return NextResponse.json({ success: true, watchedMovies: updatedWatchedMovies });
  } catch (error) {
    console.error('Error in removeMovieFromWatched route:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}
