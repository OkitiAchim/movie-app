import "./css/App.css";
import MovieCard from "./components/movieCard";
import Favourites from "./pages/Favourites";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { MovieProvider } from "./context/MovieContext";
import MovieDetails from "./pages/MovieDetails";

function App() {
  const movieNumber = 2;

  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Favourites" element={<Favourites />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
