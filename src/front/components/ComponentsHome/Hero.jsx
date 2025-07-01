import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";

const Hero = () => (
  <section className="bg-purple-light text-center text-lg-start py-5">
    <div className="container">
      <div className="row align-items-center gx-5">
        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
          <h1 className="display-4 fw-bold text-purple-dark">
            Cuida a tus mascotas como nunca antes
          </h1>
          <p className="lead text-white">
            Simplifica y mejora el cuidado de tu perro o gato con la primera IA
            especializada en mascotas y consejos veterinarios personalizados.
          </p>
          <Link to="/signup">
            <button className="btn btn-main btn-lg mt-3">
              Comenzar gratis
            </button>
          </Link>
        </div>
        <div className="col-12 col-lg-6 text-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/037/749/723/non_2x/ai-generated-dog-and-cat-on-transparent-background-free-png.png"
            alt="Perrito feliz"
            className="img-fluid rounded-3 hero-img"
          />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

