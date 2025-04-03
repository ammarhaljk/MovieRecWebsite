const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./database.sqlite');

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`);

// Create watched_movies table
db.run(`
  CREATE TABLE IF NOT EXISTS watched_movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    movie_title VARCHAR(255) NOT NULL,
    movie_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('Error creating tables:', err.message);
  } else {
    console.log('Tables created successfully.');
  }
  db.close();
});
