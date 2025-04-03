import pickle
import json
import sqlite3
import numpy as np
from implicit.als import AlternatingLeastSquares

# Load the trained ALS model
with open("implicit_tmdb_model.pkl", "rb") as f:
    model = pickle.load(f)

# Connect to the SQLite database
conn = sqlite3.connect("../db/database.sqlite", check_same_thread=False)

# Load the movie mapping (movie ID to title)
with open("movie_map.json", "r") as f:
    movie_map = json.load(f)

# Reverse mapping (title to movie ID)
reverse_movie_map = {v: k for k, v in movie_map.items()}

def recommend_movies(user_email, n=5):
    """
    Recommend top-N movies for a given user.
    Excludes movies already watched by the user.
    """
    # Fetch the user's watched movies from the database
    cursor = conn.execute("SELECT movie_id FROM watched_movies WHERE email = ?", (user_email,))
    watched_movie_ids = set(row[0] for row in cursor.fetchall())

    # Create a user interaction vector (mock vector for demonstration purposes)
    user_vector = np.zeros(len(movie_map))
    for movie_id in watched_movie_ids:
        user_vector[movie_id] = 1  # Mark watched movies

    # Get raw recommendations (includes watched movies)
    recommended_indices, scores = model.recommend(
        user_id=0,  # ALS models use integer IDs, replace this with user index if available
        user_items=user_vector,
        N=n + len(watched_movie_ids),
        filter_already_liked_items=False
    )

    # Filter out already watched movies
    filtered_recommendations = [
        {"id": idx, "title": movie_map[idx], "score": score}
        for idx, score in zip(recommended_indices, scores)
        if idx not in watched_movie_ids
    ][:n]  # Limit to top-N

    return filtered_recommendations

if __name__ == "__main__":
    # Example usage
    user_email = "test@example.com"  # Replace with actual user email
    recommendations = recommend_movies(user_email)

    # Return JSON output
    print(json.dumps({"success": True, "recommendations": recommendations}, indent=4))
