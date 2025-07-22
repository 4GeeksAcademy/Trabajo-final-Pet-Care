import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VeterinarianSection from "../components/ComponentesDashboard/VeterinarianSection";
import PremiumSection from "../components/ComponentesDashboard/PremiumSection";
import Footer from "../components/Footer";
import PetList from "../components/PetList";
import "../styles/dashboard.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState(null);
  const [loadingPets, setLoadingPets] = useState(true);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) return navigate("/login");

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch(`${BACKEND}/api/pets?user_id=${parsedUser.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar mascotas");
        return res.json();
      })
      .then(setPets)
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      })
      .finally(() => {
        setTimeout(() => setLoadingPets(false), 4000);
      });
  }, [navigate]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <img
          src="https://th.bing.com/th/id/R.1d07d3bf5c6e31cc81ea32d42e0ca896?rik=fyCMQz18dEzp%2bA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-6l_paC5jSAA%2fUUXd-ZujCPI%2fAAAAAAAAC2I%2f74BZTvZkKds%2fs1600%2fperro.gif"
          alt="Cargando…"
          style={{ width: 200 }}
        />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="dashboard container py-5 mt-5 flex-grow-1">
        <div className="dashboard__header mb-4 d-flex justify-content-between align-items-center">
          <h1 className="dashboard__title">
            ¡Bienvenido,{" "}
            <span className="text-purple-mid">{user.nombre}</span>!
          </h1>
          <button
            className="btn btn-main"
            onClick={() => navigate("/register-pet")}
          >
            + Añadir mascota
          </button>
        </div>

        {loadingPets ? (
          <div className="text-center my-5">
            <img
              src="https://i.pinimg.com/originals/1d/07/d3/1d07d3bf5c6e31cc81ea32d42e0ca896.gif"
              alt="Cargando peluditos…"
              style={{ width: 200 }}
            />
            <p>Cargando peluditos…</p>
          </div>
        ) : (
          <PetList
            pets={pets}
            onDelete={(id) => setPets((prev) => prev.filter((p) => p.id !== id))}
          />
        )}

        <VeterinarianSection />
        <PremiumSection />
      </div>
      <Footer />
    </div>
  );
}
