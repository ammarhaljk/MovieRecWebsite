import requests
import json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db import get_db_connection  # Import from db.py

# TMDB API settings
API_KEY = "f84a49149b1cf577fd6bfbf5c1d61757"
BASE_URL = "https://api.themoviedb.org/3"

def fetch_movie_details(movie_id):
    """
    Fetch movie details from TMDB API.
    """
    response = requests.get(
        f"{BASE_URL}/movie/{movie_id}",
        params={"api_key": API_KEY, "language": "en-US"}
    )
    if response.status_code == 200:
        data = response.json()
        genres = [genre["name"] for genre in data.get("genres", [])]
        return {
            "id": data["id"],
            "title": data["title"],
            "genres": " ".join(genres),
            "popularity": data["popularity"],
            "release_year": data["release_date"].split("-")[0] if data.get("release_date") else "",
            "poster_path": data["poster_path"],  # Add poster_path
            "overview": data["overview"]         # Add overview
        }
    return None

def get_user_id(email):
    """
    Get the user_id corresponding to the provided email.
    """
    conn = get_db_connection()
    cursor = conn.execute("SELECT id FROM users WHERE email = ?", (email,))
    result = cursor.fetchone()
    conn.close()
    if result:
        return result[0]
    return None

def get_watched_movies(user_id):
    """
    Get the list of watched movies for a user based on user_id.
    """
    conn = get_db_connection()
    cursor = conn.execute("SELECT movie_id FROM watched_movies WHERE user_id = ?", (user_id,))
    watched_movies = [row[0] for row in cursor.fetchall()]
    conn.close()
    return watched_movies

def fetch_top_rated_movies(pages=5):
    """
    Fetch a large list of top-rated movies from TMDB.
    """
    movies = []
    for page in range(1, pages + 1):
        response = requests.get(
            f"{BASE_URL}/movie/top_rated",
            params={"api_key": API_KEY, "language": "en-US", "page": page}
        )
        if response.status_code == 200:
            data = response.json()
            movies.extend(data.get("results", []))
    return [{"id": movie["id"], "title": movie["title"]} for movie in movies]

def recommend_movies(email, n=5):
    """
    Recommend movies based on content similarity.
    """
    user_id = get_user_id(email)
    if not user_id:
        return {"success": False, "message": "User not found"}

    watched_movie_ids = get_watched_movies(user_id)
    
    # Fetch details for watched movies
    watched_movies = [fetch_movie_details(movie_id) for movie_id in watched_movie_ids]
    watched_movies = [movie for movie in watched_movies if movie]  # Remove None values
    
    # Fetch a large pool of movies to recommend from
    pool_movies = fetch_top_rated_movies(pages=5)
    pool_movie_ids = [movie["id"] for movie in pool_movies]
    
    # Exclude already watched movies from the pool
    pool_movie_ids = [movie_id for movie_id in pool_movie_ids if movie_id not in watched_movie_ids]
    pool_movies = [fetch_movie_details(movie_id) for movie_id in pool_movie_ids]
    pool_movies = [movie for movie in pool_movies if movie]  # Remove None values

    # Create feature vectors (using genres and popularity)
    vectorizer = CountVectorizer()
    all_movies = watched_movies + pool_movies
    feature_matrix = vectorizer.fit_transform([f"{movie['genres']} {movie['popularity']}" for movie in all_movies])
    
    # Compute cosine similarity
    similarity_matrix = cosine_similarity(feature_matrix[:len(watched_movies)], feature_matrix[len(watched_movies):])
    
    # Find top N recommendations
    recommended_indices = similarity_matrix.mean(axis=0).argsort()[-n:][::-1]
    recommended_movies = [pool_movies[idx] for idx in recommended_indices]
    
    return {"success": True, "recommendations": recommended_movies}

if __name__ == "__main__":
    # Example usage
    user_email = "test@test.com"  # Replace with an actual email
    recommendations = recommend_movies(user_email, n=5)
    print(json.dumps(recommendations, indent=4))
