import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

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
    navigate("/");
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-purple-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img
            src="/img/petlogo.png"
            alt="Logo Maskots"
            style={{ height: "70px", marginRight: "10px" }}
            className="logo-navbar"
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
                {userState && (
                  <li className="nav-item d-flex align-items-center">
                    <span className="nav-link mb-0 me-1">¡ Hola</span>
                    <Link
                      className="nav-link p-0 fw-bold navbar-user-link"
                      to={`/user/${userState.id}`}
                    >
                      {userState.nombre}
                    </Link>
                    <span className="nav-link mb-0 ps-1">!</span>
                  </li>
                )}
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