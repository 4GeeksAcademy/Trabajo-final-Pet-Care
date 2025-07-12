import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VeterinarianSection from "../components/ComponentesDashboard/VeterinarianSection";
import Footer from "../components/Footer";
import PetList from "../components/PetList";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) return navigate("/login");

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/pets?user_id=${parsedUser.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar mascotas");
        return res.json();
      })
      .then((data) => setPets(data))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-purple-mid" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="dashboard container py-5 mt-5 flex-grow-1">
        <div className="dashboard__header mb-4 d-flex justify-content-between align-items-center">
          <h1 className="dashboard__title">
            ¡Bienvenido, <span className="text-purple-mid">{user.nombre}</span>!
          </h1>
          <button
            className="btn btn-main"
            onClick={() => navigate("/register-pet")}
          >
            + Añadir mascota
          </button>
        </div>
        <PetList
          pets={pets}
          onDelete={(id) => setPets((prev) => prev.filter((p) => p.id !== id))}
        />

        {/* Sección Mi Veterinario integrada en el mismo Dashboard */}
        <VeterinarianSection />
      </div>
      <Footer />
    </div>
  );
}
