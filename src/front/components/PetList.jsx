import React, { useEffect, useState } from "react";
import PetCard from "./PetCard";

const PetList = ({ userId }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pets?user_id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setPets(data);
                setLoading(false);
            });
    }, [userId]);

    if (loading) return <p>Cargando mascotas...</p>;
    if (!pets.length) return <p>No tienes mascotas registradas.</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Mis Mascotas</h2>
            <div className="row g-4">
                {pets.map((pet) => (
                    <div className="col-12 col-md-6 col-lg-4" key={pet.id}>
                        <PetCard pet={pet} />
                    </div>
                ))}
            </div>
        </div>
    );
};



export default PetList;