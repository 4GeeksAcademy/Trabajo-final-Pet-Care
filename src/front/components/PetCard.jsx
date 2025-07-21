import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const PetCard = ({ pet, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`¿Seguro que quieres eliminar a ${pet.nombre}?`)) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/pet/${pet.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Error al eliminar mascota");
      }
      onDelete(pet.id); 
      alert("Mascota eliminada correctamente");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden position-relative">
      <button
        className="btn btn-sm  position-absolute top-0 end-0 m-2"
        onClick={handleDelete}
        title="Eliminar mascota"
        style={{ zIndex: 10, fontSize: '1.2rem', lineHeight: '1' }}
      >
        🗑️
      </button>

      <div style={{ position: "relative" }}>
        <img
          src={pet.foto || "https://placehold.co/300x200?text=Mascota"}
          className="card-img-top"
          alt={pet.nombre}
          style={{ objectFit: "cover", height: "220px", width: "100%" }}
        />
        <span
          className="badge bg-purple-dark position-absolute top-0 start-0 m-2"
          style={{ fontSize: "0.75rem", padding: "0.4em 0.6em" }}
        >
          {pet.especie}
        </span>
      </div>
      <div className="card-body d-flex flex-column justify-content-between">
        <h3 className="card-title text-center mb-2">{pet.nombre}</h3>
        <Link
          to={`/pets/${pet.id}`}
          className="btn btn-pet w-100 mt-3 fw-semibold"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
