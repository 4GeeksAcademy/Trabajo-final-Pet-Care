import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VeterinarianSection from "../components/ComponentesDashboard/VeterinarianSection";
import Footer from "../components/Footer";
import PetList from "../components/PetList";
import "../styles/dashboard.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDonation, setShowDonation] = useState(false);
  const [loadingDonation, setLoadingDonation] = useState(false);

  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("donation") === "ok") {
      setShowThanks(true);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (!token || !storedUser) {
        navigate("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const res = await fetch(`${BACKEND}/api/pets?user_id=${parsedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar mascotas");
        const petsData = await res.json();
        setPets(petsData);

      } catch (err) {
        localStorage.clear();
        navigate("/login");
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    }
    loadData();

  }, [navigate]);

  const handleDonar = () => setShowDonation(true);

  const handleStripeDonation = async (amount) => {
    setLoadingDonation(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND}/api/create-donation-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        alert(`Error del backend: ${errMsg}`);
        setShowDonation(false);
        return;
      }
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Error con Stripe. Intenta más tarde.");
        setShowDonation(false);
      }
    } catch (e) {
      alert("Error con Stripe.");
      setShowDonation(false);
    } finally {
      setLoadingDonation(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "#f2e5f6" }}>
        <img
          src="/img/cargandopet.gif"
          alt="Cargando…"
          style={{ width: 400, marginBottom: 24 }}
        />
        <p className="fs-4 text-purple-dark mb-0">Cargando a tus peludos....</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* MODAL DE AGRADECIMIENTO */}
      {showThanks && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(40,0,40,0.18)", zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 text-center p-4 position-relative">
              <button
                type="button"
                className="btn-close position-absolute end-0 top-0 m-3"
                onClick={() => setShowThanks(false)}
                aria-label="Cerrar"
              />
              <img
                src="https://tse3.mm.bing.net/th/id/OIP.vKJuCabShdU4FgmMkKA_lgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="perrito"
                style={{
                  width: 80,
                  margin: "0 auto 18px auto",
                  filter: "drop-shadow(0 4px 8px #9b59b640)",
                  display: "block",
                  borderRadius: "50%"
                }}
              />
              <h4 className="mb-2" style={{ color: "#9b59b6" }}>¡Gracias por tu donación!</h4>
              <div style={{ fontSize: 16, color: "#444" }}>
                Tu apoyo permite que sigamos ayudando a más peluditos.<br />
                ¡Eres parte de la familia Pet Tracker! 🐶✨
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard container py-5 mt-5 flex-grow-1">
        <div className="dashboard__header mb-4 d-flex justify-content-between align-items-center">
          <h1 className="dashboard__title">
            ¡Bienvenido,{" "}
            <span className="text-purple-mid">{user?.nombre}</span>!
          </h1>
          <button
            className="btn btn-main"
            onClick={() => navigate("/register-pet")}
          >
            + Añadir mascota
          </button>
        </div>

        {/* BLOQUE DE DONACIÓN MEJORADO */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-10">
            <div
              className="rounded-4 shadow-sm p-4 d-flex align-items-center flex-wrap"
              style={{
                background: "linear-gradient(90deg, #f2e5f6 60%, #e7f7fd 100%)",
                border: "1.5px solid #9b59b630",
                minHeight: 120,
              }}
            >
              <div className="d-flex align-items-center" style={{ minWidth: 120 }}>
                <img
                  src="https://tse3.mm.bing.net/th/id/OIP.vKJuCabShdU4FgmMkKA_lgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                  alt="Donar perrito"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 2px 8px #9b59b620",
                    marginRight: 24,
                    animation: "wag 1.2s infinite alternate"
                  }}
                />
              </div>
              <div className="flex-grow-1">
                <h5 className="mb-1" style={{ color: "#9b59b6", fontWeight: 700, letterSpacing: 0.5 }}>
                  ¿Te gusta Pet Tracker?
                </h5>
                <div className="mb-2" style={{ color: "#333", fontSize: 16 }}>
                  Esta app es gratis y nace por amor a los animales.<br />
                  Si quieres apoyarnos y ayudar a más peluditos, puedes donar desde $2.
                </div>
                <button
                  className="btn btn-main px-4 py-2 fw-bold shadow-sm"
                  style={{ background: "#9b59b6", color: "#fff", fontSize: 18, borderRadius: "24px" }}
                  onClick={handleDonar}
                >
                  😍 Apoyar ahora
                </button>
                <span className="ms-3 badge rounded-pill bg-light text-purple-mid shadow-sm" style={{ fontSize: 13 }}>
                  100% va a mejorar la app y ayudar perritos 🐾
                </span>
              </div>
            </div>
          </div>
        </div>
        <style>
          {`
          @keyframes wag {
            0% { transform: rotate(-9deg); }
            100% { transform: rotate(9deg); }
          }
          `}
        </style>

        {/* MODAL DE DONACIÓN MEJORADO */}
        {showDonation && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(40,0,40,0.25)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ color: "#9b59b6" }}>
                    ¡Gracias por apoyar Pet Tracker!
                  </h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDonation(false)} />
                </div>
                <div className="modal-body text-center">
                  <img
                    src="https://tse4.mm.bing.net/th/id/OIP.fvftWZl2bxF0ZAKAMABNqAHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="perrito"
                    style={{
                      width: 90,
                      marginBottom: 16,
                      filter: "drop-shadow(0 4px 8px #9b59b640)",
                      borderRadius: 20
                    }}
                  />
                  <p className="mb-4" style={{ color: "#444", fontSize: 17 }}>
                    Tu aporte hace posible que sigamos creando una app mejor, <b>¡y ayudando a más peluditos!</b><br />
                    ¿Con cuánto quieres ayudar?
                  </p>
                  {[2, 5, 10].map(amount => (
                    <button
                      key={amount}
                      className="btn btn-outline-main mx-2 mb-2"
                      style={{
                        minWidth: 90,
                        background: "#fff",
                        color: "#9b59b6",
                        border: "2px solid #9b59b6",
                        fontWeight: "bold",
                        borderRadius: 20,
                        boxShadow: "0 2px 8px #9b59b620",
                        fontSize: 17
                      }}
                      disabled={loadingDonation}
                      onClick={() => handleStripeDonation(amount)}
                    >
                      {loadingDonation ? "Procesando..." : `$${amount}`}
                    </button>
                  ))}
                  <div className="mt-3 text-muted" style={{ fontSize: 13 }}>
                    <span className="fw-bold">¡GRACIAS! 🐶✨</span>
                    <br />
                    Pet Tracker es <b>100% independiente y gratuito</b>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <PetList
          pets={pets}
          onDelete={(id) => setPets((prev) => prev.filter((p) => p.id !== id))}
        />

        <VeterinarianSection />
      </div>
    </div>
  );
}
