export default function MovieCard({ movie, onClick }) {
  const truncatedDescription =
    movie.overview.length > 120
      ? `${movie.overview.slice(0, 120)}...`
      : movie.overview;

  return (
    <div
      className="relative group movie-card p-4 bg-[#45474b] text-[#f5f7f8] rounded-lg shadow-md transition-all duration-300 hover:bg-[#379777] hover:z-10 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      {/* Movie Poster */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} Poster`}
        className="rounded-md"
      />

      {/* Movie Title */}
      <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>

      {/* Movie Description */}
      <p
        className={`text-sm mt-1 transition-all duration-300 ${
          "group-hover:max-h-[200px] group-hover:overflow-visible"
        }`}
        style={{
          maxHeight: "3.6rem", // Truncate to ~3 lines by default
          overflow: "hidden", // Prevent overflow in default state
        }}
      >
        {truncatedDescription}
      </p>
    </div>
  );
}
