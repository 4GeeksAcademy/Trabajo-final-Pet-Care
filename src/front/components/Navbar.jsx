import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/navbar.css";
import logo from "../assets/img/logo-pet.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useGlobalReducer();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    const ok = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    if (!ok) return;  
    dispatch({ type: "reset_store" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-purple-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <img
            src={logo}
            alt="PetCare Logo"
            className="navbar-logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Registrarse
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn-maskots" to="/login">
                    Iniciar Sesión
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-logout"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

