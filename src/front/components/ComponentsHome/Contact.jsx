import React from "react";
import "../../styles/home.css";

const Contact = () => (
  <section className="py-5 bg-light text-center">
    <div className="container">
      <h2 className="fw-bold mb-3">Contáctanos</h2>
      <p className="mb-0">
        ¿Tienes dudas? Escríbenos a{" "}
        <a href="mailto:soporte@petcare.com" className="link-primary">
          soporte@petcare.com
        </a>
      </p>
    </div>
  </section>
);

export default Contact;
