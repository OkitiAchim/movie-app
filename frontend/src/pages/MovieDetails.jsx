import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
        );
        if (!res.ok) throw new Error("Failed to fetch movie");

        const providerRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`,
        );
        if (!providerRes.ok)
          throw new Error("Failed to fetch streaming providers");
        const providerData = await providerRes.json();
        setProviders(providerData.results?.US?.flatrate || []);

        const data = await res.json();
        const castRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
        );
        if (!castRes.ok) throw new Error("Failed to fetch cast");
        const castData = await castRes.json();
        setCast(castData.cast.slice(0, 4));

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
      <div className="movie-header">
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>

        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="rating">⭐ {movie.vote_average.toFixed(1)}</p>
          <p className="overview">{movie.overview}</p>
        </div>
      </div>

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
            <p className="actor-name">{actor.name}</p>
            <p className="character-name">{actor.character}</p>
          </div>
        ))}
      </div>

      <h2>Watch on</h2>
      <div className="providers-list">
        {providers.length > 0 ? (
          providers.map((p) => (
            <div key={p.provider_id} className="provider-card">
              <img
                src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                alt={p.provider_name}
              />
              <p>{p.provider_name}</p>
            </div>
          ))
        ) : (
          <p className="no-providers">
            Not available for streaming in your region
          </p>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
