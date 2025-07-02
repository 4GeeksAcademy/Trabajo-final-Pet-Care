// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/navbar.css';
import useGlobalReducer from "../hooks/useGlobalReducer";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const handleLogout = () => {
    dispatch({ type: "reset_store" });
    setOpen(false);
    navigate("/");
  };

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
            <li className="nav-item">
              <button
                className="nav-link btn btn-danger"
                style={{ border: "none", background: "none" }}
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
