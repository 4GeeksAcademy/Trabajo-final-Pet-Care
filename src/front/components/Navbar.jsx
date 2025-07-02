// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-purple-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🐾 PetCare
        </Link>
        <button
          className="navbar-toggler"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                onClick={() => setOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/signup"
                onClick={() => setOpen(false)}
              >
                Registrarse
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link btn-maskots"
                to="/login"
                onClick={() => setOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
