import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/petdetails.css";

const PetDetails = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState("alimentacion");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPet = async () => {
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pet/${petId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error fetching");
      setPet(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSuccess("");
  }, [activeTab]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const updatedPet = {};

    if (form.nombre.value && form.nombre.value !== pet.nombre) updatedPet.nombre = form.nombre.value;
    if (form.peso.value && parseFloat(form.peso.value) !== pet.peso) updatedPet.peso = parseFloat(form.peso.value);
    if (form.especie.value && form.especie.value !== pet.especie) updatedPet.especie = form.especie.value;
    if (form.raza.value && form.raza.value !== (pet.raza || "")) updatedPet.raza = form.raza.value;
    if (form.foto.value && form.foto.value !== (pet.foto || "")) updatedPet.foto = form.foto.value;

    if (!Object.keys(updatedPet).length) {
      setError("No hay cambios para guardar.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/pet/${petId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPet),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error updating");


      setSuccess("Actualización exitosa");
      const modalEl = document.getElementById("modalEditarMascota");
      if (modalEl && window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        modal.hide();
      }

      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

      fetchPet();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, [petId]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 py-5 flex-grow-1">
        <Link to="/dashboard" className="btn btn-link mb-4">← Volver al dashboard</Link>

        {loading && <p className="text-center">Procesando...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        {!loading && pet && (
          <div className="row">
          
            <div className="col-md-3 mb-4">
              <div className="list-group">
                <button className="list-group-item" data-bs-toggle="modal" data-bs-target="#modalVacunas">💉 Vacunas</button>
                <button className="list-group-item" data-bs-toggle="modal" data-bs-target="#modalHistorial">📋 Historial Médico</button>
                <button className={`list-group-item ${activeTab === "alimentacion" ? "active" : ""}`} onClick={() => setActiveTab("alimentacion")}>🍽 Alimentación</button>
                <button className={`list-group-item ${activeTab === "ia" ? "active" : ""}`} onClick={() => setActiveTab("ia")}>🤖 Recomendaciones IA</button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="col-md-9">
              <div className="card p-4 shadow-sm position-relative">
                <button className="btn btn-sm btn-outline-secondary position-absolute top-0 start-0 m-3" data-bs-toggle="modal" data-bs-target="#modalEditarMascota">⚙️</button>
                <div className="text-center mb-4">
                  <img src={pet.foto || "https://placehold.co/400x300?text=Mascota"} alt={pet.nombre} className="rounded" style={{ height: "250px", objectFit: "cover" }} />
                  <h2 className="mt-3">{pet.nombre}</h2>
                  <p className="text-muted">{pet.especie} – {pet.raza || "Sin raza"} – {pet.peso} kg</p>
                </div>

                {activeTab === "alimentacion" && <div><h5 className="mb-3">🍽 Alimentación</h5><p>Aquí puedes ver y editar los hábitos alimenticios de {pet.nombre}.</p></div>}
                {activeTab === "ia" && <div><h5 className="mb-3">🤖 Recomendaciones IA</h5><p>Estas son sugerencias personalizadas para {pet.nombre} generadas con IA.</p></div>}

                {success && <div className="alert alert-success mt-4">{success}</div>}
              </div>
            </div>

            <div className="col-12">

              <div className="modal fade" id="modalVacunas" tabIndex="-1" aria-labelledby="modalVacunasLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered"><div className="modal-content rounded-4"><div className="modal-header"><h5 className="modal-title" id="modalVacunasLabel">💉 Vacunas de {pet.nombre}</h5><button type="button" className="btn-close" data-bs-dismiss="modal" /></div><div className="modal-body">{pet.vacunas?.length ? <ul className="list-group">{pet.vacunas.map(v => <li key={v.id} className="list-group-item">{v.nombre} – {v.fecha_aplicacion}</li>)}</ul> : <p>No hay vacunas registradas.</p>}</div></div></div></div>

              <div className="modal fade" id="modalHistorial" tabIndex="-1" aria-labelledby="modalHistorialLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered"><div className="modal-content rounded-4"><div className="modal-header"><h5 className="modal-title" id="modalHistorialLabel">📋 Historial médico de {pet.nombre}</h5><button type="button" className="btn-close" data-bs-dismiss="modal" /></div><div className="modal-body"><p>Aquí aparecerán las consultas, enfermedades y tratamientos.</p></div></div></div></div>

              <div className="modal fade" id="modalEditarMascota" tabIndex="-1" aria-labelledby="modalEditarMascotaLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered"><div className="modal-content rounded-4"><div className="modal-header"><h5 className="modal-title" id="modalEditarMascotaLabel">✏️ Editar datos de {pet.nombre}</h5><button type="button" className="btn-close" data-bs-dismiss="modal" /></div><div className="modal-body"><form onSubmit={handleUpdate}><div className="mb-3"><label className="form-label">Nombre</label><input name="nombre" className="form-control" defaultValue={pet.nombre} /></div><div className="mb-3"><label className="form-label">Peso (kg)</label><input name="peso" type="number" step="0.1" className="form-control" defaultValue={pet.peso} /></div><div className="mb-3"><label className="form-label">Especie</label><input name="especie" className="form-control" defaultValue={pet.especie} /></div><div className="mb-3"><label className="form-label">Raza</label><input name="raza" className="form-control" defaultValue={pet.raza} /></div><div className="mb-3"><label className="form-label">Foto (URL)</label><input name="foto" className="form-control" defaultValue={pet.foto} /></div>{error && <p className="text-danger">{error}</p>}<button type="submit" className="btn btn-main w-100">Guardar cambios</button></form></div></div></div></div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PetDetails;
