import React from "react";
import Footer from "../components/Footer"; 
import "../styles/about.css"; 

const About = () => (
  <>
    {/* HERO CON VIDEO DE FONDO */}
    <section className="about-hero position-relative text-white text-center d-flex align-items-center justify-content-center">
      <video
        className="about-video-bg"
        src="https://videos.pexels.com/video-files/1883747/1883747-hd_1920_1080_25fps.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="about-hero-overlay"></div>
      <div className="about-hero-content container position-relative z-2 py-5">
        <h1 className="display-3 fw-bold mb-3 text-shadow">
          Mucho más que una app para mascotas
        </h1>
        <p className="lead mb-4 fs-4 text-shadow">
          PetCare Tracker es una comunidad global de personas que creen que cada mascota merece una vida mejor.<br />
          Tecnología + propósito = impacto real en el bienestar animal.
        </p>
      </div>
    </section>

    {/* QUIÉNES SOMOS */}
    <section className="about-section py-5 bg-white">
      <div className="container">
        <div className="row align-items-center flex-md-row flex-column-reverse">
          <div className="col-md-6 text-md-start text-center">
            <h2 className="fw-bold text-purple-dark mb-3">¿Quiénes somos?</h2>
            <p className="fs-5 mb-3">
              Somos un equipo de amantes de los animales, desarrolladores, veterinarios y voluntarios que soñamos con un mundo donde cada perro y gato tenga una vida digna y feliz. Usamos inteligencia artificial para facilitarte el cuidado, seguimiento y la felicidad de tus peludos.
            </p>
            <ul className="about-list fs-5">
              <li>Organiza vacunas, visitas y recordatorios en segundos.</li>
              <li>Recibe consejos personalizados de veterinarios y expertos.</li>
              <li>Conecta con una red de ayuda y adopción responsable.</li>
            </ul>
          </div>
          <div className="col-md-6 mb-4 mb-md-0 text-center">
            <img
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&w=600"
              alt="Equipo PetCare"
              className="img-fluid rounded-4 shadow about-img"
              style={{ maxHeight: 300, objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>

    {/* IMPACTO SOCIAL */}
    <section className="about-impact-section py-5 bg-purple-soft">
      <div className="container">
        <div className="row align-items-center flex-md-row">
          <div className="col-md-6 mb-4 mb-md-0 text-center">
            <img
              src="https://images.pexels.com/photos/4587996/pexels-photo-4587996.jpeg?auto=compress&w=600"
              alt="Mascotas ayudadas"
              className="img-fluid rounded-4 shadow about-img"
              style={{ maxHeight: 240, objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6 text-md-start text-center">
            <h2 className="fw-bold mb-3 text-purple-dark">
              Tu apoyo es vida para otros peludos
            </h2>
            <p className="fs-5">
              Por cada usuario y cada aporte, <b>donamos a refugios y fundaciones</b> dedicadas a rescatar y cuidar animales abandonados.
            </p>
            <div className="row">
              <div className="col-4 text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                  alt="Vacunas"
                  style={{ width: 60, marginBottom: 10 }}
                />
                <p className="mb-0">Campañas de vacunas</p>
              </div>
              <div className="col-4 text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                  alt="Esterilización"
                  style={{ width: 60, marginBottom: 10 }}
                />
                <p className="mb-0">Esterilizaciones</p>
              </div>
              <div className="col-4 text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                  alt="Adopciones"
                  style={{ width: 60, marginBottom: 10 }}
                />
                <p className="mb-0">Fomento de adopciones</p>
              </div>
            </div>
            <div className="alert alert-success rounded-4 shadow-sm mt-4 text-center">
              <b>¡Gracias por ser parte!</b> Usando PetCare Tracker ayudas a salvar vidas reales.
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* TESTIMONIO VISUAL */}
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row align-items-center flex-md-row">
          <div className="col-md-6 mb-4 mb-md-0 text-center">
            <img
              src="https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&w=600"
              alt="Dueño feliz"
              className="img-fluid rounded-4 shadow"
              style={{ maxHeight: 240, objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6 text-md-start text-center">
            <h3 className="fw-bold mb-3 text-purple-dark">¿Sabías qué...?</h3>
            <p className="fs-5">
              <i>
                “Gracias a PetCare Tracker, adopté a Luna y ahora está sana, feliz y siempre protegida. La app me recuerda todo y siento que pertenezco a una comunidad que realmente ayuda.”
              </i>
              <br />
              <b>- Mariana, mamá de Luna</b>
            </p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </>
);

export default About;
