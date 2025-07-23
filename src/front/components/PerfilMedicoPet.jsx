import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const PROBLEMAS_SALUD = [
  "Agresividad",
  "Ansiedad",
  "Marcaje con orina",
  "Enfermedad dental",
  "Alergias cutáneas - dermatitis",
  "Insuficiencia pancreática exocrina",
  "Alergias alimentarias",
  "Enfermedad inflamatoria crónica intestinal",
  "Shunt hepático",
];

export default function PerfilMedicoPet({ petId }) {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  const [showProblemas, setShowProblemas] = useState(false);
  const [problemasSeleccionados, setProblemasSeleccionados] = useState([]);
  const [alergias, setAlergias] = useState([]);
  const [showAlergias, setShowAlergias] = useState(false);
  const [esterilizado, setEsterilizado] = useState(false);
  const [showEsterilizacion, setShowEsterilizacion] = useState(false);

  // Peso e historial
  const [pesos, setPesos] = useState([]);
  const [loadingPesos, setLoadingPesos] = useState(false);
  const [showPesoModal, setShowPesoModal] = useState(false);
  const [nuevoPeso, setNuevoPeso] = useState({ peso: "", fecha: "" });

  // Nuevo flujo: crear perfil médico
  const [showCrearPerfil, setShowCrearPerfil] = useState(false);
  const [nuevoPerfil, setNuevoPerfil] = useState({
    alergias: "",
    condiciones_previas: "",
    esterilizado: false
  });

  // 1. Traer perfil médico
  useEffect(() => {
    async function fetchPerfil() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pets/${petId}/perfil_medico`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          setPerfil(null);
          setError("No hay perfil médico para esta mascota.");
        } else {
          const data = await res.json();
          setPerfil(data);
          setProblemasSeleccionados(data.condiciones_previas ? data.condiciones_previas.split(";") : []);
          setAlergias(data.alergias ? data.alergias.split(";") : []);
          setEsterilizado(data.esterilizado);
        }
      } catch (err) {
        setPerfil(null);
        setError("Error de conexión o formato de datos.");
      } finally {
        setLoading(false);
      }
    }
    fetchPerfil();
  }, [petId]);

  useEffect(() => {
    const fetchPesos = async () => {
      setLoadingPesos(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pets/${petId}/pesos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPesos(data);
      } catch (err) {
        setPesos([]);
      } finally {
        setLoadingPesos(false);
      }
    };
    fetchPesos();
  }, [petId, showPesoModal]);

  const handleAddPeso = async (e) => {
    e.preventDefault();
    if (!nuevoPeso.peso || !nuevoPeso.fecha) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pets/${petId}/pesos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevoPeso)
      });
      setShowPesoModal(false);
      setNuevoPeso({ peso: "", fecha: "" });
    } catch (err) {
      alert("No se pudo guardar el peso");
    }
  };

  const handleGuardarProblemas = async () => {
    await savePerfil({ condiciones_previas: problemasSeleccionados.join(";") });
    setShowProblemas(false);
  };
  const handleGuardarAlergias = async () => {
    await savePerfil({ alergias: alergias.join(";") });
    setShowAlergias(false);
  };
  const handleRemoveProblema = async (problema) => {
    const nuevos = problemasSeleccionados.filter(p => p !== problema);
    await savePerfil({ condiciones_previas: nuevos.join(";") });
  };
  const handleRemoveAlergia = async (alergia) => {
    const nuevas = alergias.filter(a => a !== alergia);
    await savePerfil({ alergias: nuevas.join(";") });
  };
  const handleGuardarEsterilizacion = async () => {
    await savePerfil({ esterilizado });
    setShowEsterilizacion(false);
  };

  const savePerfil = async (campos) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pets/${petId}/perfil_medico`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...perfil, ...campos }),
      });
      if (!res.ok) throw new Error("Error al guardar.");
      const data = await res.json();
      setPerfil(data);
      setProblemasSeleccionados(data.condiciones_previas ? data.condiciones_previas.split(";") : []);
      setAlergias(data.alergias ? data.alergias.split(";") : []);
      setEsterilizado(data.esterilizado);
    } catch (err) {
      setError("No se pudo guardar cambios.");
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <div className="alert alert-warning text-center">
        {error}
        <br />
        <Button
          variant="success"
          size="sm"
          className="mt-3"
          onClick={() => setShowCrearPerfil(true)}
        >
          Crear perfil médico
        </Button>

        {/* Modal para crear perfil médico */}
        <Modal show={showCrearPerfil} onHide={() => setShowCrearPerfil(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Crear perfil médico</Modal.Title>
          </Modal.Header>
          <Form
            onSubmit={async e => {
              e.preventDefault();
              try {
                const token = localStorage.getItem("token");
                const payload = {
                  alergias: nuevoPerfil.alergias,
                  condiciones_previas: (nuevoPerfil.condicionesCheck || []).join(";") + (nuevoPerfil.condicionesExtra ? ";" + nuevoPerfil.condicionesExtra : ""),
                  esterilizado: nuevoPerfil.esterilizado,
                };
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pets/${petId}/perfil_medico`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error("No se pudo crear el perfil médico");
                setShowCrearPerfil(false);
                setError("");
                setTimeout(() => window.location.reload(), 800);
              } catch {
                alert("Error creando el perfil médico");
              }
            }}
          >
            <Modal.Body>
              <Form.Group>
                <Form.Label>Alergias</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Separadas por ; (p. ej: Polvo; Chocolate)"
                  value={nuevoPerfil.alergias}
                  onChange={e => setNuevoPerfil({ ...nuevoPerfil, alergias: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Condiciones médicas</Form.Label>
                <div className="mb-2" style={{ maxHeight: 160, overflowY: 'auto', border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
                  {PROBLEMAS_SALUD.map((cond, i) => (
                    <Form.Check
                      key={i}
                      type="checkbox"
                      label={cond}
                      checked={nuevoPerfil.condicionesCheck && nuevoPerfil.condicionesCheck.includes(cond)}
                      onChange={e => {
                        let checks = nuevoPerfil.condicionesCheck || [];
                        if (e.target.checked) {
                          checks = [...checks, cond];
                        } else {
                          checks = checks.filter(c => c !== cond);
                        }
                        setNuevoPerfil({ ...nuevoPerfil, condicionesCheck: checks });
                      }}
                    />
                  ))}
                </div>
                <Form.Control
                  type="text"
                  placeholder="Otra condición adicional (opcional)"
                  value={nuevoPerfil.condicionesExtra || ""}
                  onChange={e => setNuevoPerfil({ ...nuevoPerfil, condicionesExtra: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Check
                  type="checkbox"
                  label="Esterilizado/a"
                  checked={nuevoPerfil.esterilizado}
                  onChange={e => setNuevoPerfil({ ...nuevoPerfil, esterilizado: e.target.checked })}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowCrearPerfil(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    );

  if (loading)
    return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
      <Spinner animation="border" variant="primary" />
    </div>;

  return (
    <div className="container py-4">
      <h3>Datos de salud de tu mascota</h3>
      {/* Peso */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <strong>Peso</strong>
          <Button variant="link" size="sm" onClick={() => setShowPesoModal(true)}>Agregar</Button>
        </div>
        <div style={{ background: "#f6f6fa", minHeight: 120, borderRadius: 8, marginBottom: 8, padding: 16 }}>
          {loadingPesos ? (
            <Spinner />
          ) : pesos.length > 0 ? (
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={pesos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} width={40} />
                <Tooltip />
                <Line type="monotone" dataKey="peso" stroke="#7C3AED" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <em>(Gráfico de peso histórico...)</em>
          )}
        </div>
        <Button variant="link" size="sm" onClick={() => setShowPesoModal(true)}>Editar</Button>
      </div>

      {/* Problemas de salud */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <strong>Problemas de salud identificados</strong>
          <div>
            {problemasSeleccionados.length === 0
              ? <em>—</em>
              : problemasSeleccionados.map((p, i) =>
                <span
                  key={i}
                  className="badge bg-secondary text-light me-1 position-relative"
                  style={{
                    fontSize: '0.88em',
                    padding: '0.32em 1.4em 0.32em 0.7em',
                    borderRadius: '1em',
                    lineHeight: '1.1'
                  }}
                >
                  {p}
                  <button
                    type="button"
                    className="btn-close btn-close-white position-absolute"
                    style={{
                      right: 4,
                      top: '50%',
                      transform: 'translateY(-50%) scale(0.6)',
                      padding: 0,
                      opacity: 0.7
                    }}
                    onClick={() => handleRemoveProblema(p)}
                    aria-label="Eliminar"
                    tabIndex={-1}
                  />
                </span>
              )
            }
          </div>
        </div>
        <Button variant="link" size="sm" onClick={() => setShowProblemas(true)}>Editar</Button>
      </div>

      {/* Alergias */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <strong>Alergias identificadas</strong>
          <div>
            {alergias.length === 0
              ? <em>—</em>
              : alergias.map((a, i) =>
                <span
                  key={i}
                  className="badge bg-danger text-light me-1 position-relative"
                  style={{
                    fontSize: '0.88em',
                    padding: '0.32em 1.4em 0.32em 0.7em',
                    borderRadius: '1em',
                    lineHeight: '1.1'
                  }}
                >
                  {a}
                  <button
                    type="button"
                    className="btn-close btn-close-white position-absolute"
                    style={{
                      right: 4,
                      top: '50%',
                      transform: 'translateY(-50%) scale(0.6)',
                      padding: 0,
                      opacity: 0.7
                    }}
                    onClick={() => handleRemoveAlergia(a)}
                    aria-label="Eliminar"
                    tabIndex={-1}
                  />
                </span>
              )
            }
          </div>
        </div>
        <Button variant="link" size="sm" onClick={() => setShowAlergias(true)}>Agregar</Button>
      </div>

      {/* Esterilización */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <strong>Esterilización</strong>
          <div>{esterilizado ? "Sí" : "No"}</div>
        </div>
        <Button variant="link" size="sm" onClick={() => setShowEsterilizacion(true)}>
          Editar
        </Button>
      </div>

      {/* PRO Banner */}
      <div className="alert alert-info d-flex align-items-center mt-4"
        style={{
          background: "#f7f6fc",
          border: "1px solid #e4e0f6",
          borderRadius: "1.2rem",
          boxShadow: "0 2px 14px 0 rgba(230,210,90,0.06)"
        }}
      >
        <span className="me-3" style={{ fontSize: "2.2rem", display: "flex", alignItems: "center" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#FFD600" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
        </span>
        <div style={{ flex: 1 }}>
          <strong style={{ fontWeight: 600, color: "#1d1940" }}>
            ¿Quieres recomendaciones personalizadas y el historial en PDF?
          </strong>
          <div className="text-muted" style={{ fontSize: "1em" }}>
            Haz upgrade a <b>GOLD</b> y recibe un informe profesional para tu mascota, listo para imprimir o compartir.
          </div>
        </div>
        <button
          className="btn btn-sm btn-main ms-3 d-flex align-items-center"
          onClick={() => window.location.href = "/upgrade"}
          style={{
            whiteSpace: "nowrap",
            background: "linear-gradient(90deg, #FFD600 60%, #FFCA28 100%)",
            color: "#222",
            fontWeight: 700,
            border: "none",
            boxShadow: "0 2px 8px 0 rgba(240,180,0,0.08)"
          }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="#FFD600" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 5 }}>
            <rect x="5" y="10" width="14" height="9" rx="2" fill="#FFD600" />
            <rect x="9" y="7" width="6" height="4" rx="3" fill="#FFD600" opacity="0.8" />
            <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="#888" strokeWidth="1.2" fill="none" />
          </svg>
          Hazte PRO
        </button>
      </div>

      {/* --------- MODALS --------- */}
      {/* Modal Problemas */}
      <Modal show={showProblemas} onHide={() => setShowProblemas(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Problemas de salud</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 350, overflowY: "auto" }}>
          <Form>
            {PROBLEMAS_SALUD.map((problema, i) => (
              <Form.Check
                key={i}
                type="checkbox"
                label={problema}
                checked={problemasSeleccionados.includes(problema)}
                onChange={e => {
                  setProblemasSeleccionados(arr =>
                    e.target.checked
                      ? [...arr, problema]
                      : arr.filter(p => p !== problema)
                  );
                }}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProblemas(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarProblemas}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Alergias */}
      <Modal show={showAlergias} onHide={() => setShowAlergias(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva alergia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            placeholder="Alergia"
            value={alergias[alergias.length - 1] || ""}
            onChange={e => {
              let nuevas = [...alergias];
              nuevas[nuevas.length - 1] = e.target.value;
              setAlergias(nuevas);
            }}
            onBlur={() => setAlergias(arr => arr.filter(a => a))}
          />
          <Button
            variant="link"
            onClick={() => setAlergias(arr => [...arr, ""])}
            className="mt-2"
          >
            + Añadir más
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlergias(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarAlergias}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Esterilización */}
      <Modal show={showEsterilizacion} onHide={() => setShowEsterilizacion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Esterilización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              label="Sí"
              name="esterilizacion"
              checked={esterilizado === true}
              onChange={() => setEsterilizado(true)}
            />
            <Form.Check
              type="radio"
              label="No"
              name="esterilizacion"
              checked={esterilizado === false}
              onChange={() => setEsterilizado(false)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEsterilizacion(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarEsterilizacion}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para registrar nuevo peso */}
      <Modal show={showPesoModal} onHide={() => setShowPesoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar nuevo peso</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddPeso}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Peso (kg)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={nuevoPeso.peso}
                onChange={e => setNuevoPeso({ ...nuevoPeso, peso: parseFloat(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={nuevoPeso.fecha}
                onChange={e => setNuevoPeso({ ...nuevoPeso, fecha: e.target.value })}
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPesoModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
