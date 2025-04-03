import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({
  isOpen,
  setSidebarOpen,
  genres,
  onGenreChange,
  onSearchMovies,
  isLoggedIn,
  userEmail,
  onLogout,
  onOpenLoginModal, // Function to open the login modal
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all"); // Added selectedGenre state
  const router = useRouter();

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchMovies(term); // Trigger the search handler when the user types
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value); // Update selected genre state
    onGenreChange(value); // Call the parent handler to filter movies
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full ${
        isOpen ? "w-64" : "w-0"
      } bg-[#45474b] text-[#f5f7f8] overflow-hidden transition-all duration-500 z-10`}
    >
      <div className="p-4">

        {/* Genre Filter */}
        <section className="mb-4">
          <h2 className="text-lg mb-2">Filter Movies by Genre</h2>
          <select
            id="genre-filter"
            className="w-full p-2 bg-[#f5f7f8] text-[#45474b] rounded-md"
            value={selectedGenre} // Controlled component with selectedGenre state
            onChange={(e) => handleGenreChange(e.target.value)}
          >
            <option value="all">All</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </section>

        {/* Search Movies */}
        <section className="mb-4">
          <h2 className="text-lg mb-2">Search Movies by Name</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter movie name"
            className="w-full p-2 bg-[#f5f7f8] text-[#45474b] rounded-md outline-none"
          />
        </section>
      </div>

      {/* AI Button - Login Gating */}
      <div className="p-4">
        {isLoggedIn ? (
          <button
            onClick={() => router.push("/ai")}
            className="w-full py-2 bg-[#379777] text-[#f5f7f8] rounded-md font-semibold hover:bg-[#28775b] transition"
          >
            Try Our AI Recommendations
          </button>
        ) : (
          <button
            disabled
            className="w-full py-2 bg-[#6c757d] text-[#f5f7f8] rounded-md font-semibold cursor-not-allowed"
          >
            Login To Try Our AI!
          </button>
        )}
      </div>

      {/* View Profile Button */}
      {isLoggedIn && (
        <div className="p-4">
          <button
            onClick={() => router.push("/profile")}
            className="w-full py-2 bg-[#379777] text-[#f5f7f8] rounded-md font-semibold hover:bg-[#28775b] transition"
          >
            View Profile
          </button>
        </div>
      )}

      {/* Login/Logout Section */}
      <div className="absolute bottom-4 w-full px-4">
        {isLoggedIn ? (
          <div>
            <p className="mb-2 text-sm text-[#f5f7f8]">
              Logged in as: <strong>{userEmail}</strong>
            </p>
            <button
              onClick={onLogout}
              className="w-full py-2 bg-[#d9534f] text-[#f5f7f8] rounded-md font-semibold text-lg hover:bg-[#c9302c] transition"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLoginModal} // Call the function to open the login modal
            className="w-full py-2 bg-[#379777] text-[#f5f7f8] rounded-md font-semibold text-lg hover:bg-[#28775b] transition"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </aside>
  );
}
