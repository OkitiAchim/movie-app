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
  const [searchResults, setSearchResults] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const popular = await getPopularMovies(page);
        const trending = await getTrendingMovies();
        const topRated = await getTopRatedMovies();

        setPopularMovies(popular);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results);
      setError(null);
      setHasMore(false); // Disable infinite scroll while searching
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
        setPopularMovies((prev) => [...prev, ...newMovies]);
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
        hasMore &&
        searchResults.length === 0 // only load more if not searching
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, popularMovies, searchResults]);

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
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

      {/* Loading skeleton for first load */}
      {loading && page === 1 && (
        <div className="movies-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="movie-skeleton" key={index}></div>
          ))}
        </div>
      )}

      {/* If search results exist, show them first */}
      {searchResults.length > 0 && (
        <section>
          <h2 className="section-title">Search Results</h2>
          <div className="movies-grid">
            {searchResults.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
        </section>
      )}

      {/* If no search or after search, show Trending / Top Rated / Popular */}
      {searchResults.length === 0 && !loading && (
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
              {popularMovies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Loading skeleton for infinite scroll */}
      {loading && page > 1 && (
        <div className="movies-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="movie-skeleton" key={index}></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
