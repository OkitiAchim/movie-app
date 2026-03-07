import { Link, useLocation } from "react-router-dom";
import "../css/Navbar.css";
import logo from "../assets/Logo.png";

function NavBar() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="movie App logo" className="logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-links ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>

        <Link
          to="/favourites"
          className={`nav-links ${
            location.pathname === "/favourites" ? "active" : ""
          }`}
        >
          Favourites
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
