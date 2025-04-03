"use client";

import React, { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "next/navigation";

export default function AIRecommendations() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({ rating: "", releaseYear: "" });
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
    }
  }, []);

  async function fetchRecommendations(email) {
    try {
      const requestBody = { email, n: 5 };

      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      if (data.success) {
        // Ensure default values for each movie property
        const sanitizedRecommendations = data.recommendations.map((movie) => ({
          id: movie.id,
          title: movie.title || "Untitled",
          overview: movie.overview || "No description available.",
          poster_path: movie.poster_path || "/default-poster.jpg", // Use a default poster if missing
        }));
        setRecommendations(sanitizedRecommendations);
      } else {
        throw new Error(data.message || "No recommendations found");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    }
  }

  useEffect(() => {
    if (user && user.email) {
      fetchRecommendations(user.email);
    }
  }, [user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="min-h-screen bg-[url('/stars.gif')] text-[#f5f7f8] font-sans p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-[#45474b] p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold">AI Recommendations</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-[#379777] text-[#f5f7f8] rounded-md font-semibold hover:bg-[#28775b] transition"
          >
            Return to Home
          </button>
        </div>


        {/* Recommendations Section */}
        {recommendations.length > 0 ? (
          <div>
            <p className="mb-4 text-lg">
              Based on your watched list, here are some movies you might like:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommendations.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-lg text-center">
            No recommendations available yet. Adjust the filters or add more
            movies to your watched list to get personalized recommendations!
          </p>
        )}
      </div>
    </div>
  );
}
