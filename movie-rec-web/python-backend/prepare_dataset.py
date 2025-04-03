import pandas as pd
import requests

# TMDB API Configuration
API_KEY = "f84a49149b1cf577fd6bfbf5c1d61757"  # Replace with your TMDB API key
BASE_URL = "https://api.themoviedb.org/3"

# Example user-movie interactions (replace with your own data)
user_movie_data = [
    {"user_id": 1, "movie_title": "The Shawshank Redemption", "rating": 5},
    {"user_id": 1, "movie_title": "The Godfather", "rating": 4},
    {"user_id": 2, "movie_title": "The Dark Knight", "rating": 5},
    {"user_id": 2, "movie_title": "Pulp Fiction", "rating": 3},
    {"user_id": 3, "movie_title": "Inception", "rating": 4},
    {"user_id": 3, "movie_title": "Fight Club", "rating": 4},
]

# Fetch movie IDs from TMDB API
def fetch_movie_id(movie_title):
    response = requests.get(
        f"{BASE_URL}/search/movie",
        params={"api_key": API_KEY, "query": movie_title},
    )
    data = response.json()
    if data["results"]:
        return data["results"][0]["id"]
    return None

# Add TMDB movie IDs to the dataset
for record in user_movie_data:
    record["movie_id"] = fetch_movie_id(record["movie_title"])

# Convert to DataFrame
df = pd.DataFrame(user_movie_data)

# Save the dataset as a CSV file
df.to_csv("user_movie_ratings.csv", index=False)
print("Dataset saved as user_movie_ratings.csv")
