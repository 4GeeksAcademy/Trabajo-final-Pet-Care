import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light" style={{ marginTop: "30px" }}>
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <section
          className="w-100 d-flex align-items-center justify-content-center"
          style={{
            minHeight: "calc(120vh - 160px)",
            paddingTop: 48,
            paddingBottom: 48,
          }}
        >
          <div
            className="rounded-4 shadow bg-white w-100"
            style={{ maxWidth: 480, padding: "2.5rem 2rem" }}
          >
            <div className="d-flex justify-content-center mb-3">
              <img
                src="https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg"
                alt="Gato y perro"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 2px 16px #c5b7e6a0",
                  border: "5px solid #fff",
                }}
              />
            </div>
            <h1 className="fw-bold text-purple-dark mb-3 text-center">Contáctanos</h1>
            <p className="mb-4 text-center" style={{ fontSize: 15 }}>
              ¿Tienes dudas, sugerencias o quieres colaborar? Rellena el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
            {submitted ? (
              <div className="alert alert-success rounded-4 text-center">
                ¡Gracias por tu mensaje! Pronto nos pondremos en contacto contigo.
              </div>
            ) : (
              <form className="row g-3" onSubmit={handleSubmit}>
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
                <div className="col-12 d-flex justify-content-center">
                  <button className="btn btn-main btn-lg px-4" type="submit">
                    Enviar mensaje
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
