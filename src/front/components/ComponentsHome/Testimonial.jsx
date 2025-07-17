import React, { useRef, useEffect } from "react";
import "../../styles/home.css";

const reviews = [
  {
    stars: 5,
    title: "Muy buena idea",
    text: "Me ayuda muchísimo a recordar las cosas que tengo que hacer con mi perro.",
    footer: "Padre de mascota de Reino Unido",
  },
  {
    stars: 5,
    title: "Todo lo que necesitaba para gestionar mis mascotas",
    text: "Es perfecto para organizarte y tener toda la información en el mismo sitio. Me ha encantado!",
    footer: "Padre de mascota de Chile",
  },
  {
    stars: 5,
    title: "Muy útil.",
    text: "Una app para no olvidarme de nada con mi perra. Muy útil, es personalizada y además el chat AI está fenomenal.",
    footer: "Padre de mascota de Venezuela",
  },
 {
    stars: 4,
    title: "Todo lo que necesitaba para gestionar mis mascotas",
    text: "Es perfecto para organizarte y tener toda la información en el mismo sitio. Me ha encantado!",
    footer: "Padre de mascota de Argentina",
  },
  {
    stars: 5,
    title: "Muy útil.",
    text: "Una app para no olvidarme de nada con mi perra. Muy útil, es personalizada y además el chat AI está fenomenal.",
    footer: "Padre de mascota de Chile",
  },
{
    stars: 5,
    title: "Muy buena idea",
    text: "Me ayuda muchísimo a recordar las cosas que tengo que hacer con mi perro.",
    footer: "Padre de mascota de España",
  },
  {
    stars: 4,
    title: "Todo lo que necesitaba para gestionar mis mascotas",
    text: "Es perfecto para organizarte y tener toda la información en el mismo sitio. Me ha encantado!",
    footer: "Padre de mascota de España",
  },
  {
    stars: 4,
    title: "Todo lo que necesitaba para gestionar mis mascotas",
    text: "Es perfecto para organizarte y tener toda la información en el mismo sitio. Me ha encantado!",
    footer: "Padre de mascota de Venezuela",
  },
  {
    stars: 4,
    title: "Todo lo que necesitaba para gestionar mis mascotas",
    text: "Es perfecto para organizarte y tener toda la información en el mismo sitio. Me ha encantado!",
    footer: "Padre de mascota de Argentina",
  },
  {
    stars: 4,
    title: "Todo lo que necesitaba para gestionar mis mascotas",
    text: "Es perfecto para organizarte y tener toda la información en el mismo sitio. Me ha encantado!",
    footer: "Padre de mascota de Chile",
  },
];

const Testimonial = () => {
  const scrollRef = useRef(null);

  const SCROLL_AMOUNT = 300;
  const handlePrev = () => {
    scrollRef.current.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };
  const handleNext = () => {
    scrollRef.current.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".testimonial-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("active", entry.isIntersecting);
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-5 bg-hero-gradient-from position-relative">
      <div className="container text-center mb-4">
        <h2 className="fw-bold">
          Lo que otras <span className="text-purple-dark">familias</span> están
          diciendo{" "}
          <span className="text-danger">❤</span>
        </h2>
      </div>

      <button
        className="btn btn-outline-secondary btn-sm carousel-btn prev-btn"
        onClick={handlePrev}
      >
        ←
      </button>
      <button
        className="btn btn-outline-secondary btn-sm carousel-btn next-btn"
        onClick={handleNext}
      >
        →
      </button>

      <div
        className="d-flex gap-4 overflow-auto scroll-container px-3"
        ref={scrollRef}
      >
        {reviews.map((r, i) => (
          <div
            key={i}
            className="card flex-shrink-0 border-0 shadow-sm testimonial-card"
          >
            <div className="card-body text-center">
              <div className="mb-3">
                {[...Array(r.stars)].map((_, idx) => (
                  <span key={idx} className="text-warning">
                    ★
                  </span>
                ))}
              </div>
              <h5 className="card-title fw-bold">{r.title}</h5>
              <p className="card-text text-secondary">{r.text}</p>
            </div>
            <div className="card-footer bg-transparent border-0 text-center">
              <small className="text-muted">{r.footer}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
