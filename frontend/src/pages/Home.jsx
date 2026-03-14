import MovieCard from "../components/movieCard";
import { useState, useEffect } from "react";
import "../css/Home.css";
import {
  searchMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "../Services/api";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Infinite scroll states ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const popular = await getPopularMovies(page);
        const trending = await getTrendingMovies();
        const topRated = await getTopRatedMovies();

        setMovies(popular);
        setTrendingMovies(trending);
        setTopRatedMovies(topRated);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
      setError(null);
      setHasMore(false); // Disable infinite scroll on search
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const newMovies = await getPopularMovies(nextPage);

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
        setPage(nextPage);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load more movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, movies]);

  return (
    <div className="home">
      <form onSubmit={handSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading && page === 1 ? (
        <div className="movies-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="movie-skeleton" key={index}></div>
          ))}
        </div>
      ) : (
        <>
          <section>
            <h2 className="section-title">Trending Movies</h2>
            <div className="movie-row">
              {trendingMovies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-title">Top Rated Movies</h2>
            <div className="movie-row">
              {topRatedMovies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-title">Popular Movies</h2>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          </section>

          {loading && page > 1 && (
            <div className="movies-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="movie-skeleton" key={index}></div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
