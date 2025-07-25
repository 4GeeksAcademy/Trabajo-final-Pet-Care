import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useGlobalReducer();

  const [userState, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const token = localStorage.getItem("token");

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onUserUpdated = () => {
      const updatedUser = localStorage.getItem("user");
      setUserState(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener("userUpdated", onUserUpdated);
    return () => window.removeEventListener("userUpdated", onUserUpdated);
  }, []);

  const handleLogout = () => {
    const ok = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    if (!ok) return;
    dispatch({ type: "reset_store" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState(null);
    setOpen(false);
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-purple-dark fixed-top">
      <div className="container">
        {/* SOLO link si NO hay token */}
        {!token ? (
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <img
              src="/img/petlogo.png"
              alt="Logo Pet Tracker"
              style={{ height: "70px", marginRight: "10px" }}
              className="logo-navbar"
            />
          </Link>
        ) : (
          <span className="navbar-brand fw-bold d-flex align-items-center">
            <img
              src="/img/petlogo.png"
              alt="Logo Pet Tracker"
              style={{ height: "70px", marginRight: "10px", cursor: "default" }}
              className="logo-navbar"
            />
          </span>
        )}
        <button
          className="navbar-toggler"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    Quiénes somos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">
                    Contáctanos
                  </Link>
                </li>
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
                <li className="nav-item position-relative" ref={userMenuRef}>
                  <button
                    className="btn btn-user-avatar d-flex align-items-center justify-content-center"
                    onClick={() => setShowUserMenu((show) => !show)}
                    style={{
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {userState?.foto ? (
                      <img
                        src={userState.foto}
                        alt={userState.nombre}
                        className="rounded-circle"
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          border: "2px solid #fff",
                          boxShadow: "0 2px 8px #6C40B5AA",
                        }}
                      />
                    ) : (
                      <i
                        className="fas fa-user-circle"
                        style={{ fontSize: 40, color: "#eee" }}
                      />
                    )}
                  </button>
                  {/* Menú flotante */}
                  {showUserMenu && (
                    <div
                      className="user-menu-dropdown shadow rounded-4 bg-white p-3 position-absolute end-0 mt-2"
                      style={{ minWidth: 180, zIndex: 999 }}
                    >
                      <div
                        className="text-muted mb-2"
                        style={{ fontSize: 14 }}
                      >
                        ¡Hola, <b>{userState.nombre}</b>!
                      </div>
                      <Link
                        to={`/user/${userState.id}`}
                        className="dropdown-item fw-semibold mb-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <i className="fas fa-id-badge me-2 text-purple-mid"></i>
                        Ver perfil
                      </Link>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
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
