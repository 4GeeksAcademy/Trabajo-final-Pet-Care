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
    dogUrl: "https://tse4.mm.bing.net/th/id/OIP.IweJ98rAXq8-3xDm5GIYEwHaEr?rs=1&pid=ImgDetMain&o=7&rm=3",
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
    dogUrl: "https://img.freepik.com/fotos-premium/cabeza-perro-chow-chow-fondo-blanco_980353-4471.jpg?w=2000",
    buttonText: "Contratar Gold",
  },
];

export default function PremiumSection() {
  return (
    <section className="premium-section py-5">
      <div className="container">
        <div className="text-center mb-4">
          <span className="fs-1">🚀</span>
          <h2 className="d-inline-block ms-2 text-white">Elige tu suscripción y mantén a tu peludo feliz y sano</h2>
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
                      <h3 className="card-title mb-1 text-purple-mid">
                        {plan.name}
                      </h3>
                      <h5 className="card-subtitle text-green-mid">
                        {plan.price}
                      </h5>
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
