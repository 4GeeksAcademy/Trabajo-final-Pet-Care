import React from "react";

const plans = [
  {
    name: "Silver",
    price: "9.99",
    description: "Funciones Silver por un mes",
    key: "silver"
  },
  {
    name: "Gold",
    price: "19.99",
    description: "Acceso premium total por un mes",
    key: "gold"
  }
];

export default function Plans() {
  const handleSubscribe = async (planKey) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ plan: planKey }),
    });
    // Revisa el status antes de parsear JSON
    if (!res.ok) {
      const errMsg = await res.text();
      alert(`Error del backend: ${errMsg}`);
      return;
    }
    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert(data.msg || "Error iniciando pago (sin checkout_url)");
      console.log(data);
    }
  } catch (err) {
    alert("Error en el pago (catch)");
    console.error(err);
  }
};

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, borderRadius: 12, background: "#fff", boxShadow: "0 4px 24px #0001" }}>
      <h2 style={{ textAlign: "center", marginBottom: 32 }}>Elige tu plan</h2>
      <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
        {plans.map((plan) => (
          <div key={plan.key} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 24, minWidth: 220 }}>
            <h3 style={{ margin: 0 }}>{plan.name}</h3>
            <p style={{ fontSize: 24, fontWeight: 700, margin: "8px 0" }}>€{plan.price}</p>
            <p style={{ margin: "8px 0" }}>{plan.description}</p>
            <button
              style={{ marginTop: 12, padding: "8px 24px", background: "#6772e5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
              onClick={() => handleSubscribe(plan.key)}
            >
              Suscribirse
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
