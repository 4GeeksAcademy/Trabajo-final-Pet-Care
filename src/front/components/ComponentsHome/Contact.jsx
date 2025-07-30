import React from "react";
import "../../styles/home.css";

const Contact = () => (
  <section className="py-5 bg-light text-center">
    <div className="container">
      {/* Imagen de perrito arriba del título */}
      <img
        src="https://tse3.mm.bing.net/th/id/OIP.77211XCX-CVqiLDCnwow6QHaE8?w=612&h=408&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="Perrito simpático"
        className="mb-4 rounded-circle shadow"
        style={{ width: 110, height: 110, objectFit: "cover", border: "4px solid #fff" }}
      />
      <h2 className="fw-bold mb-3">Contáctanos</h2>
      <p className="mb-0">
        ¿Tienes dudas? Escríbenos a{" "}
        <a href="mailto:soporte@petcare.com" className="link-primary">
          soporte@pettracker.com
        </a>
      </p>
    </div>
  </section>
);

export default Contact;
