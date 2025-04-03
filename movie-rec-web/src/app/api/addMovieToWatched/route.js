import { NextResponse } from 'next/server';
import { openDb } from '../../../../db/sqlite';

export async function POST(req) {
  try {
    const { email, movie } = await req.json();
    const db = await openDb();

    // Get the user's ID
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    // Check if the movie already exists in the watched list
    const existingMovie = db
      .prepare('SELECT * FROM watched_movies WHERE user_id = ? AND movie_id = ?')
      .get(user.id, movie.id);

    if (existingMovie) {
      return NextResponse.json({ success: false, message: 'Movie already in watched list' });
    }

    // Insert the movie into the watched list
    db.prepare('INSERT INTO watched_movies (user_id, movie_title, movie_id) VALUES (?, ?, ?)')
      .run(user.id, movie.title, movie.id);

    // Fetch the updated list of watched movies
    const updatedWatchedMovies = db
      .prepare('SELECT movie_title AS title, movie_id AS id FROM watched_movies WHERE user_id = ?')
      .all(user.id);

    return NextResponse.json({ success: true, watchedMovies: updatedWatchedMovies });
  } catch (error) {
    console.error('Error in addMovieToWatched route:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}
