import React from "react";
import "../../styles/premium.css";

const plans = [
  {
    name: "Silver",
    price: "$9.99/mes",
    perks: [
      "Recordatorios de vacunación",
      "Acceso a historial nutricional básico",
      "Descuentos en tiendas aliadas (5%)",
    ],
    dogUrl: "https://your.cdn.com/husky-silver.png",
    buttonText: "Contratar Silver",
  },
  {
    name: "Gold",
    price: "$19.99/mes",
    perks: [
      "Todo de Silver, más:",
      "Recomendaciones IA personalizadas",
      "Historial médico completo",
      "Descuentos en tiendas aliadas (10%)",
      "Soporte VIP 24/7",
    ],
    dogUrl: "https://your.cdn.com/husky-gold.png",
    buttonText: "Contratar Gold",
  },
];

export default function PremiumSection() {
  return (
    <section className="premium-section py-5">
      <div className="container">
        <div className="text-center mb-4">
          <span className="fs-1">🚀</span>
          <h2 className="d-inline-block ms-2">Elige tu paquete Premium</h2>
        </div>
        <div className="row gy-4">
          {plans.map((plan) => (
            <div key={plan.name} className="col-12 col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={plan.dogUrl}
                      alt={`Perrito ${plan.name}`}
                      className="premium-dog-img me-3"
                    />
                    <div>
                      <h5 className="card-title mb-1 text-purple-mid">
                        {plan.name}
                      </h5>
                      <h6 className="card-subtitle text-green-mid">
                        {plan.price}
                      </h6>
                    </div>
                  </div>
                  <ul className="list-unstyled flex-grow-1">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="d-flex align-items-start mb-2">
                        <span className="feature-bullet me-2 mt-1" />
                        <small>{perk}</small>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-purple-mid mt-auto">
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
