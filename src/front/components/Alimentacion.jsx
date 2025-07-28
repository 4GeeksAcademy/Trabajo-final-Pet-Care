import React, { useEffect, useState } from "react";
import "../styles/alimentacion.css";
import Spinner from "react-bootstrap/Spinner";

const Alimentacion = ({ petId, pet, token }) => {
  const [recomendacion, setRecomendacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchWithAuth = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

  useEffect(() => {
    if (!petId || !token) return;
    setLoading(true);
    setErrMsg("");
    fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}api/pet/${petId}/alimentacion`)
      .then(res => {
        if (res.ok) return res.json();
        if (res.status === 404) throw new Error("No hay recomendación registrada");
        throw new Error("Error al consultar alimentación");
      })
      .then(data => {
        setRecomendacion(data.texto);
        setLoading(false);
      })
      .catch(err => {
        if (err.message === "No hay recomendación registrada") {
          fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}api/pet/${petId}/alimentacion`, {
            method: "POST",
          })
            .then(res => {
              if (!res.ok) throw new Error("Error generando recomendación");
              return res.json();
            })
            .then(data => {
              setRecomendacion(data.texto);
              setLoading(false);
            })
            .catch(() => {
              setErrMsg("No se pudo generar la recomendación de alimentación. Intenta más tarde.");
              setLoading(false);
            });
        } else {
          setErrMsg("Error consultando la recomendación.");
          setLoading(false);
        }
      });
  }, [petId, token]);

  if (loading)
    return (
      <div
        className="alimentacion-card d-flex justify-content-center align-items-center"
        style={{ minHeight: "220px" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (errMsg)
    return (
      <div className="alert alert-warning rounded-4">{errMsg}</div>
    );

  return (
    <div className="alimentacion-card">
      <div className="alimentacion-emoji">🍽️</div>
      <div className="alimentacion-title">Alimentación</div>
      <div className="alimentacion-contenido">
        {recomendacion}
      </div>
      <div className="alimentacion-footer">
        Recomendación generada por IA
      </div>
    </div>
  );
};

export default Alimentacion;
