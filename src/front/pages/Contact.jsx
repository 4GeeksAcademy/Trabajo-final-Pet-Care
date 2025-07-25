import React, { useState } from "react";
import Footer from "../components/Footer"; // Ajusta el path si tu Footer está en otra carpeta

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar integración real (API, emailjs, Netlify, etc.)
    setSubmitted(true);
  };

  return (
    <>
      <section className="py-5 bg-light">
        <div className="container">
          <h1 className="fw-bold text-purple-dark mb-4">Contáctanos</h1>
          <p className="mb-4">
            ¿Tienes dudas, sugerencias o quieres colaborar? Rellena el formulario y nos pondremos en contacto contigo lo antes posible.
          </p>
          {submitted ? (
            <div className="alert alert-success rounded-4">
              ¡Gracias por tu mensaje! Pronto nos pondremos en contacto contigo.
            </div>
          ) : (
            <form className="row g-3" onSubmit={handleSubmit} style={{ maxWidth: 540 }}>
              <div className="col-12">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Mensaje</label>
                <textarea
                  className="form-control"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  required
                ></textarea>
              </div>
              <div className="col-12">
                <button className="btn btn-main btn-lg" type="submit">
                  Enviar mensaje
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
