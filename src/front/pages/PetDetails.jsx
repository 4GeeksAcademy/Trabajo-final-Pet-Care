import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PetDetails = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pet/${petId}`)
      .then(res => res.json())
      .then(data => setPet(data));
  }, [petId]);

  if (!pet) return <p>Cargando detalles...</p>;
  if (pet.msg) return <p>{pet.msg}</p>; // Si hay error desde el backend

  return (
    <div className="container py-4">
      <Link to="/pets" className="btn btn-link mb-3">← Volver</Link>
      <div className="card mx-auto" style={{ maxWidth: 400 }}>
        <img
          src={pet.foto || "https://placehold.co/400x300?text=Mascota"}
          className="card-img-top"
          alt={pet.nombre}
        />
        <div className="card-body">
          <h3 className="card-title">{pet.nombre}</h3>
          <p><strong>Especie:</strong> {pet.especie}</p>
          <p><strong>Raza:</strong> {pet.raza}</p>
          <p><strong>Peso:</strong> {pet.peso} kg</p>
        </div>
      </div>
    </div>
  );
};



export default PetDetails;