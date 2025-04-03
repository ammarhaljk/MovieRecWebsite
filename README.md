# Movie Recommendation System

## Overview
This project is a movie recommendation system that suggests movies based on content similarity. It utilizes the TMDB API to fetch movie details and a database to track user watch history. The recommendation engine uses TF-IDF vectorization and cosine similarity to generate personalized movie recommendations.

## Features
- Fetches top-rated movies from TMDB API
- Retrieves user watch history from a database
- Computes content similarity based on genres and popularity
- Provides personalized movie recommendations
- Includes additional movie details like `poster_path` and `overview`

## Technologies Used
- Python
- Flask (if applicable for API handling)
- SQLite (or any other database for storing watch history)
- TMDB API
- Scikit-learn (for content similarity calculations)
- React (for frontend, if applicable)

## Installation
### Prerequisites
- Python 3.8+
- `pip install -r requirements.txt` (if using a `requirements.txt` file)
- TMDB API Key (replace in the script)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movierecommendation.git
   cd movierecommendation
   ```
2. Set up the database:
   ```bash
   python db.py  # Initialize database if applicable
   ```
3. Run the recommendation script:
   ```bash
   python recommend.py  # Example usage
   ```

## Usage
- Update the `API_KEY` in the script with your TMDB API key.
- Run the script and pass a user email to get recommendations.
- Example:
  ```python
  from recommend import recommend_movies
  recommendations = recommend_movies("user@example.com", n=5)
  print(recommendations)
  ```

## API Endpoints (if applicable)
If you're using a Flask/Django backend:
- `GET /recommendations?email=user@example.com` - Returns recommended movies

## License
This project is licensed under the MIT License.

## Contributors
- Your Name (@yourgithub)

## Acknowledgments
- TMDB API for movie data

