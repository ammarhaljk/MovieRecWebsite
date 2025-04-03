import requests
import pandas as pd
import pickle
from scipy.sparse import csr_matrix
from implicit.als import AlternatingLeastSquares

# TMDB API key and URL
API_KEY = "f84a49149b1cf577fd6bfbf5c1d61757"
BASE_URL = "https://api.themoviedb.org/3"

# Step 1: Fetch popular movies from TMDB
def fetch_popular_movies(page_limit=5):
    all_movies = []
    for page in range(1, page_limit + 1):
        url = f"{BASE_URL}/movie/popular?api_key={API_KEY}&language=en-US&page={page}"
        response = requests.get(url)
        data = response.json()
        movies = data.get("results", [])
        all_movies.extend(movies)
    return all_movies

# Step 2: Simulate user interactions
def generate_user_interactions(movies, num_users=100):
    interactions = []
    for user_id in range(1, num_users + 1):
        for movie in movies:
            movie_id = movie["id"]
            vote_average = movie["vote_average"]
            # Simulate an interaction score based on the vote average and randomness
            interaction_score = max(0.5, min(5.0, vote_average + (user_id % 5 - 2) * 0.5))
            interactions.append((user_id, movie_id, interaction_score))
    return interactions

# Step 3: Train and save the collaborative filtering model
def train_and_save_model():
    # Fetch data from TMDB
    movies = fetch_popular_movies(page_limit=5)
    print(f"Fetched {len(movies)} movies from TMDB.")

    # Generate synthetic user interactions
    interactions = generate_user_interactions(movies)
    df = pd.DataFrame(interactions, columns=["user_id", "movie_id", "interaction"])

    # Create a sparse user-item interaction matrix
    user_ids = df["user_id"].unique()
    movie_ids = df["movie_id"].unique()

    user_map = {user_id: index for index, user_id in enumerate(user_ids)}
    movie_map = {movie_id: index for index, movie_id in enumerate(movie_ids)}

    rows = df["user_id"].map(user_map)
    cols = df["movie_id"].map(movie_map)
    data = df["interaction"]

    interaction_matrix = csr_matrix((data, (rows, cols)), shape=(len(user_ids), len(movie_ids)))

    # Train the ALS model
    model = AlternatingLeastSquares(factors=50, regularization=0.1, iterations=20)
    model.fit(interaction_matrix.T)  # Transpose because implicit expects items x users

    # Save the model and mappings
    with open("implicit_tmdb_model.pkl", "wb") as f:
        pickle.dump({"model": model, "user_map": user_map, "movie_map": movie_map, "movies": movies}, f)

    print("Model trained and saved as 'implicit_tmdb_model.pkl'")

# Run the training process
if __name__ == "__main__":
    train_and_save_model()
