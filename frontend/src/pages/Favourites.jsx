import "../css/Favorites.css";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/movieCard";
function Favourite() {
  const { favourites } = useMovieContext();

  if (!favourites || favourites.length === 0) {
    return (
      <div className="favourites-empty">
        <h2>No Favourite Movies Yet</h2>
        <p>Start adding movies to your favourites and they will appear here</p>
      </div>
    );
  }

  return (
    <div className="favourites">
      <h2>Your Favourites</h2>
      <div className="movies-grid">
        {favourites.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
}

export default Favourite;
