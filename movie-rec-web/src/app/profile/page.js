"use client";

import React, { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]); // Ensure it's initialized as an array
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const API_KEY = "f84a49149b1cf577fd6bfbf5c1d61757";
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);

      // Fetch user's watched movies
      fetch(`/api/getUserMovies?email=${user.email}`)
        .then((response) => response.json())
        .then((data) => setWatchedMovies(data.watchedMovies || []))
        .catch((error) => console.error("Error fetching watched movies:", error));
    }
  }, []);

  const handleSearchMovies = async (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          term
        )}&language=en-US&page=1`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const handleAddMovieToWatched = (movie) => {
    if (!user) return;

    // Prevent duplicate movies by checking IDs
    if (watchedMovies.some((watchedMovie) => watchedMovie.id === movie.id)) {
      alert(`"${movie.title}" is already in your watched list.`);
      return;
    }

    fetch("/api/addMovieToWatched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, movie: { id: movie.id, title: movie.title } }),
    })
      .then((response) => response.json())
      .then((data) => {
        setWatchedMovies(data.watchedMovies); // Update the watched movies list dynamically
        setSearchTerm(""); // Clear the search input
        setSearchResults([]); // Clear the search results
      })
      .catch((error) => console.error("Error adding movie:", error));
  };

  const handleRemoveMovieFromWatched = (movieId) => {
    fetch("/api/removeMovieFromWatched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, movieId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to remove movie");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setWatchedMovies(data.watchedMovies); // Update the watched movies list dynamically
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error removing movie:", error));
  };

  return (
    <div className="min-h-screen bg-[url('/stars.gif')] text-[#f5f7f8] font-sans p-8">
      {user ? (
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-[#45474b] p-6 rounded-lg shadow-lg mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.email}</h1>
              <p className="text-lg">Manage your profile and movie preferences here.</p>
            </div>
            <button
              onClick={() => router.push("/")} // Navigate to the home page
              className="px-4 py-2 bg-[#379777] text-[#f5f7f8] rounded-md font-semibold hover:bg-[#28775b] transition"
            >
              Return to Home
            </button>
          </div>

          {/* Already Watched List */}
          <div className="bg-[#45474b] p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Already Watched Movies</h2>
            {watchedMovies.length > 0 ? (
              <ul className="space-y-2">
                {watchedMovies.map((movie, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-[#379777] text-[#f5f7f8] p-2 rounded-md shadow-md"
                  >
                    <span>{movie.title}</span> {/* Display the movie title */}
                    <button
                      onClick={() => handleRemoveMovieFromWatched(movie.id)}
                      className="px-3 py-1 bg-[#d9534f] text-white rounded-md hover:bg-[#c9302c] transition"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No movies in your watched list yet.</p>
            )}
          </div>

          {/* Search and Add Movies */}
          <div className="bg-[#45474b] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Search and Add Movies</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchMovies(e.target.value)}
              placeholder="Search for a movie"
              className="w-full p-3 mb-6 bg-[#f5f7f8] text-[#45474b] rounded-md outline-none"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleAddMovieToWatched(movie)} // Add movie on click
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-xl">You need to log in to view your profile.</p>
      )}
    </div>
  );
}
