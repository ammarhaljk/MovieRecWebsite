import sqlite3

def get_db_connection():
    """
    Returns a new SQLite database connection.
    """
    return sqlite3.connect("..\\db\\database.sqlite")
