import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";

const Hero = () => (
  <section className="hero-section position-relative text-center text-lg-start py-5">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="hero-video-bg"
      src="https://videos.pexels.com/video-files/3191251/3191251-uhd_2732_1440_25fps.mp4"
    />
    <div className="hero-overlay"></div>
    <div className="container position-relative" style={{ zIndex: 2 }}>
      <div className="row align-items-center gx-5">
        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
          <h1 className="display-4 fw-bold text-purple-soft">
            Cuida a tus mascotas como nunca antes
          </h1>
          <p className="lead text-white">
            Simplifica y mejora el cuidado de tu perro o gato con la primera app con IA
            especializada en mascotas y consejos veterinarios personalizados.
          </p>
          <Link to="/signup">
            <button className="btn btn-main btn-lg mt-3">
              Comenzar gratis
            </button>
          </Link>
        </div>
        <div className="col-12 col-lg-6 hero-img-col">
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
