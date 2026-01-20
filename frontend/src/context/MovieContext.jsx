import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem("favourites");

    if (storedFavs) {
      setFavourites(JSON.parse(storedFavs));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (movie) => {
    setFavourites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) return prev;
      return [...prev, movie];
    });
  };

  const removeFromFavourites = (movieId) => {
    setFavourites((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const isFavourites = (movieId) => {
    return favourites.some((movie) => movie.id === movieId);
  };

  const value = {
    favourites,
    addToFavourites,
    removeFromFavourites,
    isFavourites,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
