import React from "react";
import PetCard from "./PetCard";

const PetList = ({ pets, onDelete }) => {
  if (!pets || pets.length === 0) {
    return <p className="text-muted">Aún no tienes mascotas registradas.</p>;
  }

  return (
    <section className="pets-list row gy-4">
      {pets.map((pet) => (
        <div key={pet.id} className="col-sm-6 col-md-4 col-lg-3">
          <PetCard pet={pet} onDelete={onDelete} />
        </div>
      ))}
    </section>
  );
};

export default PetList;
