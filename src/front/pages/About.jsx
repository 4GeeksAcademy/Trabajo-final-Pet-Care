import React from "react";
import Footer from "../components/Footer"; 
import "../styles/about.css"; 

const About = () => (
  <div className="min-vh-100 d-flex flex-column">
    <main className="about-impact-split flex-grow-1 d-flex flex-column">
      <div className="container-fluid g-0">
        <div className="row vh-100 gx-0 align-items-stretch about-row-custom">

          {/* HERO: Columna 1 */}
          <div className="col-md-4 d-flex align-items-center justify-content-center p-0 about-separator-right">
            <div className="about-left-hero position-relative w-100 h-100">
              <img
                src="https://sdmntprukwest.oaiusercontent.com/files/00000000-e048-6243-bb83-00af387e9dac/raw?se=2025-07-25T04%3A27%3A23Z&sp=r&sv=2024-08-04&sr=b&scid=c21fdfe7-27c7-50f7-8ce5-4b8601d145b4&skoid=71e8fa5c-90a9-4c17-827b-14c3005164d6&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-24T22%3A16%3A54Z&ske=2025-07-25T22%3A16%3A54Z&sks=b&skv=2024-08-04&sig=PNtTulBJcZPvPIk7QrHa1ssPFD7r3Rju/MPU79mazE8%3D"
                alt="Fondo solidario"
                className="about-hero-bg"
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
                src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=cover&w=400&q=80"
                alt="Perro feliz"
                className="rounded shadow-lg my-3"
                style={{ width: "210px", height: "160px", objectFit: "cover" }}
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
                src="/img/equipo.png"
                alt="Perro feliz"
                className="rounded shadow-lg my-3"
                style={{ width: "300px", height: "300px", objectFit: "cover" }}
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

export default About;
