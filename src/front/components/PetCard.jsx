import React from "react";
import { Link } from "react-router-dom";

const PetCard = ({ pet }) => (
    <div className="card h-100 shadow-sm">
        <img
            src={pet.foto || "https://placehold.co/300x200?text=Mascota"}
            className="card-img-top"
            alt={pet.nombre}
            style={{ objectFit: "cover", height: "200px" }}
        />
        <div className="card-body">
            <h5 className="card-title">{pet.nombre}</h5>
            <p className="card-text mb-1"><strong>Especie:</strong> {pet.especie}</p>
            <p className="card-text mb-1"><strong>Raza:</strong> {pet.raza}</p>
            <p className="card-text"><strong>Peso:</strong> {pet.peso} kg</p>
            <Link to={`/pets/${pet.id}`} className="btn btn-main btn-sm mt-2">
                Ver detalles
            </Link>
        </div>
    </div>
);

export default PetCard;