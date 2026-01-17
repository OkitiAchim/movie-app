import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MovieDetails() {
  const { id } = useParams();
  const [cast, setCast] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);

        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );

        if (!res.ok) throw new Error("Failed to fetch movie");

        const data = await res.json();
        const castRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
        );

        if (!castRes.ok) {
          throw new Error("Failed to fetch cast");
        }

        const castData = await castRes.json();
        setCast(castData.cast.slice(0, 10)); // limit to 10 actors

        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading movie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="movie-details">
      <h1>{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <p>
        <strong>Rating:</strong>
        {movie.vote_average}
      </p>

      <p>{movie.overview}</p>
      <h2>Cast</h2>

      <div className="cast-list">
        {cast.map((actor) => (
          <div key={actor.id} className="cast-card">
            {actor.profile_path && (
              <img
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                alt={actor.name}
              />
            )}
            <p>
              <strong>{actor.name}</strong>
            </p>
            <p>{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieDetails;
