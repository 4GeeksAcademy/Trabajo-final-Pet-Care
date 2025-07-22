import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import RecomendacionesIAView from "../components/RecomendacionesIAView";
import VacunasView from "../components/VacunasView";
import PerfilMedicoPet from "../components/PerfilMedicoPet";
import "../styles/petdetails.css";
import { BsPersonCircle, BsCapsulePill, BsClipboard2Check, BsEggFried, BsRobot } from "react-icons/bs";

const PetDetails = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => setSuccess(""), 2500);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pet/${petId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error cargando mascota");
        setPet(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId, showModal]);

  const handleOpenEdit = () => {
    setEditData({
      nombre: pet.nombre,
      especie: pet.especie,
      raza: pet.raza,
      peso: pet.peso,
      foto: pet.foto,
      fecha_nacimiento: pet.fecha_nacimiento,
      sexo: pet.sexo,
    });
    setShowModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pet/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al actualizar");
      setSuccess("Mascota actualizada correctamente");
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mascotas_unsigned");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dvqbb7cjs/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setEditData((prev) => ({ ...prev, foto: data.secure_url }));
        setSuccess("Imagen actualizada exitosamente");
      } else {
        setError("Error al subir imagen.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con Cloudinary.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container py-5 flex-grow-1">
        <Link to="/dashboard" className="btn btn-link text-purple-dark mb-4">
          ← Volver al dashboard
        </Link>
        {loading && <p className="text-center">Cargando...</p>}
        {error && <p className="text-center text-danger">{error}</p>}
        {pet && (
          <div
            className="row justify-content-center align-items-start gx-4"
            style={{ minHeight: "70vh", flexWrap: "nowrap" }}
          >
            {/* Columna 1: Foto y nombre */}
            <div className="col-12 col-md-4 d-flex justify-content-center align-items-start mb-4 mb-md-0">
              <div
                className="card shadow rounded-5 text-center position-relative"
                style={{
                  width: "350px",
                  minHeight: "430px",
                  padding: "2.5rem 1.5rem 2rem 1.5rem",
                  border: "none",
                  background: "#fff",
                  boxShadow: "0 8px 36px 0 rgba(130, 130, 200, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-3"
                  title="Editar mascota"
                  onClick={handleOpenEdit}
                  style={{ zIndex: 2 }}
                >⚙️</button>
                <img
                  src={pet.foto || "https://placehold.co/320x320?text=Mascota"}
                  alt={pet.nombre}
                  className="rounded-4 shadow"
                  style={{
                    width: "220px",
                    height: "220px",
                    objectFit: "cover",
                    marginBottom: "2rem",
                    border: "6px solid #faf8fd",
                    background: "#f4f4fb"
                  }}
                />
                <h2 style={{
                  fontSize: "2.3rem",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                  color: "#3c276a"
                }}>{pet.nombre}</h2>
              </div>
            </div>

            {/* Columna 2: Tabs */}
            <div className="col-12 col-md-2 d-flex flex-md-column flex-row align-items-center justify-content-center gap-3 my-4 my-md-0">
              {[
                { tab: "perfil", icon: <BsPersonCircle />, text: "Perfil" },
                { tab: "vacunas", icon: <BsCapsulePill />, text: "Vacunas" },
                { tab: "historial", icon: <BsClipboard2Check />, text: "Historial" },
                { tab: "alimentacion", icon: <BsEggFried />, text: "Alimentación" },
                { tab: "ia", icon: <BsRobot />, text: "IA" },
              ].map(({ tab, icon, text }) => (
                <button
                  key={tab}
                  className={`btn d-flex align-items-center w-100 mb-md-2 rounded-pill justify-content-center justify-content-md-start px-3 ${activeTab === tab
                    ? "btn-main active"
                    : "btn-outline-main"
                    }`}
                  style={{ minHeight: "44px", fontSize: "1.08em" }}
                  onClick={() => setActiveTab(tab)}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3em",
                    marginRight: 12,
                    minWidth: 22
                  }}>
                    {icon}
                  </span>
                  <span>{text}</span>
                </button>
              ))}
            </div>

            {/* Columna 3: Info dinámica */}
            <div className="col-12 col-md-6 d-flex align-items-start">
              <div className="bg-white rounded-4 shadow-sm p-4 min-vh-50 w-100">
                {activeTab === "perfil" && (
                  <div>
                    <h4>📝 Perfil</h4>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item"><b>Nombre:</b> {pet.nombre}</li>
                      <li className="list-group-item"><b>Especie:</b> {pet.especie}</li>
                      <li className="list-group-item"><b>Raza:</b> {pet.raza || "Sin raza"}</li>
                      <li className="list-group-item"><b>Peso:</b> {pet.peso} kg</li>
                      <li className="list-group-item"><b>Sexo:</b> {pet.sexo || "No disponible"}</li>
                      <li className="list-group-item"><b>Fecha de nacimiento:</b> {pet.fecha_nacimiento || "No disponible"}</li>
                    </ul>
                  </div>
                )}
                {activeTab === "vacunas" && (
                  <VacunasView petId={petId} pet={pet} user={user} />
                )}
                {activeTab === "historial" && (
                  <PerfilMedicoPet petId={petId} />
                )}
                {activeTab === "alimentacion" && (
                  <div>
                    <h4>🍽 Alimentación</h4>
                    <p>Aquí puedes ver y editar los hábitos alimenticios de {pet.nombre}.</p>
                  </div>
                )}
                {activeTab === "ia" && (
                  <RecomendacionesIAView petId={petId} pet={pet} />
                )}
                {success && <div className="alert alert-success mt-4">{success}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Modal edición mascota */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "#0008" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4">
                <div className="modal-header">
                  <h5 className="modal-title">✏️ Editar datos de {pet.nombre}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        className="form-control"
                        value={editData.nombre}
                        onChange={e => setEditData({ ...editData, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Especie</label>
                      <input
                        className="form-control"
                        value={editData.especie}
                        onChange={e => setEditData({ ...editData, especie: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Raza</label>
                      <input
                        className="form-control"
                        value={editData.raza || ""}
                        onChange={e => setEditData({ ...editData, raza: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Peso (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editData.peso || ""}
                        onChange={e => setEditData({ ...editData, peso: e.target.value })}
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Sexo</label>
                      <select
                        className="form-select"
                        value={editData.sexo || ""}
                        onChange={e => setEditData({ ...editData, sexo: e.target.value })}
                        required
                      >
                        <option value="">Selecciona sexo</option>
                        <option value="Macho">Macho</option>
                        <option value="Hembra">Hembra</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha de nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.fecha_nacimiento || ""}
                        onChange={e => setEditData({ ...editData, fecha_nacimiento: e.target.value })}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Actualizar foto (opcional)</label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {editData.foto && (
                        <img
                          src={editData.foto}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxWidth: "200px" }}
                        />
                      )}
                    </div>
                  </div>
                  {error && <p className="text-danger text-center">{error}</p>}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-main" disabled={loading}>
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PetDetails;
