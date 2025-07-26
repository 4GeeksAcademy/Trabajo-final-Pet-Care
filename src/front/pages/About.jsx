import React, { useState } from "react";
import Footer from "../components/Footer";
import "../styles/about.css";

const IMGS = [
  "/img/apoyar.png",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=cover&w=400&q=80",
  "/img/equipo.png"
];
const GIF_LOADING = "/img/cargandopet.gif";

const About = () => {

  const [loadedImgs, setLoadedImgs] = useState(0);


  const isLoaded = loadedImgs >= IMGS.length;


  const handleImgLoad = () => setLoadedImgs(l => l + 1);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {!isLoaded && (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: "#f7f6fd", position: "fixed", width: "100vw", height: "100vh", zIndex: 9999, top: 0, left: 0 }}>
          <img
            src={GIF_LOADING}
            alt="Cargando..."
            style={{ width: 300, height: 200, filter: "drop-shadow(0 4px 24px #c3b9f1)" }}
          />
        </div>
      )}

      <main className="about-impact-split flex-grow-1 d-flex flex-column" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
        <div className="container-fluid g-0">
          <div className="row vh-100 gx-0 align-items-stretch about-row-custom">
            {/* HERO: Columna 1 */}
            <div className="col-md-4 d-flex align-items-center justify-content-center p-0 about-separator-right">
              <div className="about-left-hero position-relative w-100 h-100">
                <img
                  src={IMGS[0]}
                  alt="Fondo solidario"
                  className="about-hero-bg"
                  onLoad={handleImgLoad}
                  style={{ minHeight: 50 }}
                />
                <div className="about-hero-overlay"></div>
                <div className="about-hero-content position-relative z-2 w-100 text-center">
                  <h2 className="mb-4 text-white">Tu apoyo salva vidas</h2>
                  <p className="mb-4">
                    Por cada usuario, <b>donamos a refugios y fundaciones</b> reales de perros y gatos abandonados.<br />
                    Usar Pet Tracker es transformar el mundo peludo.
                  </p>
                  <div className="mb-3 d-flex justify-content-center gap-2">
                    <span className="badge rounded-pill bg-success">Vacunas</span>
                    <span className="badge rounded-pill bg-warning text-dark">Esterilizaciones</span>
                    <span className="badge rounded-pill bg-info text-dark">Adopciones</span>
                  </div>
                  <div className="alert alert-light p-2 small mt-2" style={{ opacity: 0.97 }}>
                    <b>¡Gracias por ser parte!</b> Usando Pet Tracker ayudas a salvar vidas reales.
                  </div>
                </div>
              </div>
            </div>

            {/* MOTIVACIÓN: Columna 2 */}
            <div className="col-md-4 d-flex align-items-center justify-content-center p-0 about-separator-right">
              <div className="about-center-content w-100 text-center">
                <h3 className="fw-bold mb-3" style={{ color: "#8c51c9" }}>¿Por qué hacemos esto?</h3>
                <p>
                  <b>Amamos a los animales</b> y queremos un mundo donde cada mascota tenga acceso a salud y protección.<br />
                  Con Pet Tracker creas comunidad, recibes ayuda de expertos y haces el bien solo por usar la app.
                </p>
                <img
                  src={IMGS[1]}
                  alt="Perro feliz"
                  className="rounded shadow-lg my-3"
                  style={{ width: "210px", height: "160px", objectFit: "cover" }}
                  onLoad={handleImgLoad}
                />
                <div className="text-muted small fst-italic">
                  Tecnología + propósito = Bienestar animal real
                </div>
              </div>
            </div>

            {/* COMUNIDAD: Columna 3 */}
            <div className="col-md-4 d-flex align-items-center justify-content-center p-0 bg-green-dark">
              <div className="about-right-content w-100 text-center">
                <h3 className="fw-bold mb-3 text-white">Somos comunidad</h3>
                <p className="text-white">
                  Un equipo de desarrolladores, veterinarios y voluntarios guiados por el amor y la tecnología.<br />
                  <b>Tú eres parte de este cambio.</b>
                </p>
                <img
                  src={IMGS[2]}
                  alt="Perro feliz"
                  className="rounded shadow-lg my-3"
                  style={{ width: "300px", height: "300px", objectFit: "cover" }}
                  onLoad={handleImgLoad}
                />
                <span className="badge rounded-pill bg-success mt-2">#JuntosPorLosPeludos</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

