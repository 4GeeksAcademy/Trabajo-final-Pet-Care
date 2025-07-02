import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";

const CallToAction = () => (
  <section className="py-5 text-center bg-purple-dark">
    <div className="container">
      <h2 className="fw-bold mb-4 text-white">
        ¿Listo para cuidar mejor a tu mascota?
      </h2>
      <Link to="/signup">
        <button className="btn btn-main btn-lg">
          Regístrate ahora
        </button>
      </Link>
    </div>
  </section>
);

export default CallToAction;
