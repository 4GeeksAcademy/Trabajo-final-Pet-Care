import React from "react";
import calendarIcon from "../../icons/calendar-solid.svg";
import healthIcon   from "../../icons/notes-medical-solid.svg";
import aiIcon       from "../../icons/robot-solid.svg";
import shieldIcon   from "../../icons/shield-solid.svg";
import "../../styles/home.css";

const featuresList = [
  {
    icon: calendarIcon,
    title: "Plan de cuidado",
    items: [
      "Acciones recomendadas",
      "Fácil de planificar",
      "Creación de acciones personalizadas",
      "Recordatorios automatizados",
      "Sincronización con calendario",
    ],
  },
  {
    icon: healthIcon,
    title: "Gestor de salud",
    items: [
      "Perfil de salud",
      "Monitorización de peso",
      "Problemas de salud",
      "Veterinarios de confianza",
      "Historial médico",
    ],
  },
  {
    icon: aiIcon,
    title: "Pets AI",
    items: [
      "Inteligencia Artificial especializada para mascotas",
      "Cualquier consulta sobre el cuidado del animal",
      "Evaluación de síntomas",
      "Información sobre enfermedades",
      "Atención inmediata 24/7",
    ],
  },
  {
    icon: shieldIcon,
    title: "Consejos a medida",
    items: [
      "Información de la raza",
      "Rutinas de cuidados",
      "Recomendaciones nutricionales",
      "Problemas comunes de salud",
      "Tips de educación",
    ],
  },
];

const Features = () => (
  <section id="how-it-works" className="py-5 bg-purple-dark">
    <div className="container text-center mb-5">
      <h2 className="fw-bold text-white">La app todo en uno para el bienestar de tu mascota</h2>
      <p className="text-white">
        Mejora sin esfuerzo la salud de tus amigos peludos con un plan de cuidado personalizado.
      </p>
    </div>
    <div className="container">
      <div className="row g-4">
        {featuresList.map((f) => (
          <div key={f.title} className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm pt-5 position-relative">
              <div className="position-absolute top-0 start-50 translate-middle bg-purple-light rounded-circle p-3">
                <img src={f.icon} alt={f.title} width="24" height="24" />
              </div>
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">{f.title}</h5>
                <ul className="list-unstyled mb-0">
                  {f.items.map((item) => (
                    <li key={item} className="d-flex align-items-start mb-2">
                      <span className="badge bg-success me-2">&nbsp;</span>
                      <small className="text-secondary">{item}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
