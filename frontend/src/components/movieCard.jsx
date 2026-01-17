import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const { addToFavourites, removeFromFavourites, isFavourites } =
    useMovieContext();
  const favourite = isFavourites(movie.id);

  function onFavoriteClick(e) {
    e.preventDefault();
    if (favourite) removeFromFavourites(movie.id);
    else addToFavourites(movie);
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="movie-overlay">
            <button
              className={`favourite-btn ${favourite ? "active" : ""}`}
              onClick={onFavoriteClick}
            >
              <FaHeart />
            </button>
          </div>
        </div>
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.release_date?.split("-")[0]}</p>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
