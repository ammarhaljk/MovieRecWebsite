"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import MovieCard from "../components/MovieCard";
import LoginModal from "../components/LoginSignUp";

export default function Home() {
  const [movies, setMovies] = useState([]); // All movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Filtered movies
  const [genres, setGenres] = useState([]); // Genres
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
  const [isLoginModalVisible, setLoginModalVisible] = useState(false); // Login modal toggle state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state
  const [userEmail, setUserEmail] = useState(""); // Logged-in user's email
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  const API_KEY = "f84a49149b1cf577fd6bfbf5c1d61757";
  const BASE_URL = "https://api.themoviedb.org/3";

  // Fetch genres
  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();
      setGenres([{ id: "all", name: "All" }, ...data.genres]); // Add "All" genre option
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Fetch popular movies
  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      setMovies(data.results);
      setFilteredMovies(data.results); // Initially show all movies
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Handle search by name
  const handleSearchMovies = async (term) => {
    setSearchTerm(term); // Update the search term
    if (!term.trim()) {
      // If the search term is empty, reset to popular movies
      setFilteredMovies(movies);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          term
        )}&language=en-US&page=1`
      );
      const data = await response.json();
      setFilteredMovies(data.results); // Update the filtered movies
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  // Handle genre change
  const handleGenreChange = (genreId) => {
    if (genreId === "all") {
      setFilteredMovies(movies); // Show all movies when "All" is selected
    } else {
      setFilteredMovies(
        movies.filter((movie) => movie.genre_ids.includes(Number(genreId)))
      );
    }
  };

  // Handle login
  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("user", JSON.stringify({ email }));
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem("user");
    alert("You have successfully logged out.");
  };

  // Load user and data on component mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setIsLoggedIn(true);
      setUserEmail(user.email);
    }
    fetchGenres();
    fetchMovies();
  }, []);

  return (
    <div className="bg-[url('/stars.gif')] text-[#f5f7f8] font-sans min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        genres={genres}
        onGenreChange={handleGenreChange} // Pass genre change handler
        onSearchMovies={handleSearchMovies} // Pass search handler
        onOpenLoginModal={() => setLoginModalVisible(true)}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-500 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="flex justify-center items-center p-5 relative">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 left-4 open-btn text-2xl"
          >
            ☰
          </button>
        </header>

        <h1 className="text-2xl font-bold text-center my-4">
          Movie Recommendation
        </h1>

        {/* Movie List */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      </div>

      {/* Login Modal */}
      <LoginModal
        isVisible={isLoginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
