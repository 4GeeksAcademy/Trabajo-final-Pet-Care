import React, { useState, useEffect } from "react";

const RecomendacionesIAView = ({ petId, pet }) => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [preguntaIA, setPreguntaIA] = useState("");
  const [respuestaIA, setRespuestaIA] = useState("");
  const [loadingIA, setLoadingIA] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchRecomendaciones = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/pet/${petId}/recomendaciones`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) setRecomendaciones(data);
    } catch (e) {
      console.error("Error al obtener recomendaciones IA", e);
    }
  };

  useEffect(() => {
    fetchRecomendaciones();
    // eslint-disable-next-line
  }, [petId]);

  const handlePreguntarIA = async (e) => {
    e.preventDefault();
    setRespuestaIA("");
    setLoadingIA(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/pet/${petId}/recomendacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pregunta: preguntaIA })
      });
      const data = await res.json();
      if (res.ok) {
        setRespuestaIA(data.respuesta);
        setPreguntaIA("");
        fetchRecomendaciones();
      } else {
        setRespuestaIA("Hubo un error al generar la recomendación.");
      }
    } catch (e) {
      setRespuestaIA("Error al contactar el servidor.");
    } finally {
      setLoadingIA(false);
    }
  };

  const handleDeleteRecomendacion = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta recomendación?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/recomendacion/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setRecomendaciones((prev) => prev.filter((r) => r.id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch (e) {
      console.error("Error al eliminar recomendación:", e);
    }
  };

  return (
    <div>
      <h5 className="mb-3">🤖 Recomendaciones IA</h5>
      <p>Estas son sugerencias personalizadas para {pet.nombre} generadas con IA.</p>
      <form onSubmit={handlePreguntarIA} className="mb-3">
        <div className="mb-2">
          <label className="form-label">¿Qué deseas saber sobre el cuidado de {pet.nombre}?</label>
          <textarea
            className="form-control"
            rows="2"
            value={preguntaIA}
            onChange={(e) => setPreguntaIA(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-main" disabled={loadingIA}>
          {loadingIA ? "Consultando IA..." : "Enviar pregunta"}
        </button>
      </form>
      {respuestaIA && (
        <div className="alert alert-info mt-2">
          <strong>Respuesta IA:</strong><br />
          {respuestaIA}
        </div>
      )}
      <hr />
      {recomendaciones.length > 0 ? (
        <ul className="list-group">
          {recomendaciones.map((r) => {
            const isExpanded = expandedId === r.id;
            const preguntaCorta = r.pregunta.length > 60 ? r.pregunta.slice(0, 60) + "..." : r.pregunta;
            return (
              <li
                key={r.id}
                className="list-group-item d-flex flex-column"
                style={{ cursor: "pointer" }}
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>🗨️ Pregunta:</strong> {!isExpanded ? preguntaCorta : r.pregunta}
                    <br />
                    <small className="text-muted">📅 {new Date(r.fecha).toLocaleDateString()}</small>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecomendacion(r.id);
                    }}
                  >
                    🗑
                  </button>
                </div>
                {isExpanded && (
                  <div className="mt-2">
                    <strong>💡 Respuesta:</strong> {r.respuesta}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted">No hay recomendaciones aún.</p>
      )}
    </div>
  );
};

export default RecomendacionesIAView;
