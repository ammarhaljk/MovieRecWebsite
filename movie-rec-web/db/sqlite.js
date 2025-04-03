import Database from 'better-sqlite3';
import path from 'path';

// Function to open the SQLite database
export async function openDb() {
  const dbPath = path.resolve('db/database.sqlite'); // Absolute path to database.sqlite
  const db = new Database(dbPath);
  return db;
}
