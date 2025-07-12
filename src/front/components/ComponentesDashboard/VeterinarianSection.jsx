import React, { useEffect, useState } from "react";


const VeterinarianSection = () => {
  const [location, setLocation] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favClinics") || "[]"));

  // Obtener geolocalización del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setLocation({ lat: coords.latitude, lng: coords.longitude }),
        () => console.warn("Permiso de ubicación denegado")
      );
    }
  }, []);

  // Fetch de clínicas cercanas con Google Places API
  useEffect(() => {
    if (!location) return;
    const fetchNearby = async () => {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&type=veterinary_care&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
      );
      const json = await resp.json();
      const top5 = json.results.slice(0, 5);
      const withDetails = await Promise.all(
        top5.map(async (c) => {
          const detResp = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${c.place_id}&fields=formatted_phone_number,formatted_address&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
          );
          const detJson = await detResp.json();
          return {
            ...c,
            phone: detJson.result.formatted_phone_number,
            address: detJson.result.formatted_address,
          };
        })
      );
      setClinics(withDetails);
    };
    fetchNearby();
  }, [location]);

  const toggleFavorite = (clinic) => {
    let updated;
    if (favorites.some((f) => f.place_id === clinic.place_id)) {
      updated = favorites.filter((f) => f.place_id !== clinic.place_id);
    } else {
      updated = [...favorites, clinic];
    }
    setFavorites(updated);
    localStorage.setItem("favClinics", JSON.stringify(updated));
  };

  return (
    <section className="veterinarian-section container py-4">
      <h2>Mi Veterinario</h2>
      <div className="row">
        {/* Clínicas cercanas */}
        <div className="col-md-6">
          <h4>Cerca de mí</h4>
          {clinics.length ? (
            <ul className="list-group">
              {clinics.map((c) => (
                <li key={c.place_id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{c.name}</strong>
                    <p className="mb-1">{c.address}</p>
                    <p className="mb-0">📞 {c.phone}</p>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => toggleFavorite(c)}
                  >
                    {favorites.some((f) => f.place_id === c.place_id) ? "★" : "☆"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Buscando clínicas cercanas…</p>
          )}
        </div>

        {/* Clínicas favoritas */}
        <div className="col-md-6">
          <h4>Favoritos</h4>
          {favorites.length ? (
            <ul className="list-group">
              {favorites.map((c) => (
                <li key={c.place_id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{c.name}</strong>
                    <p className="mb-1">{c.address}</p>
                    <p className="mb-0">📞 {c.phone}</p>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => toggleFavorite(c)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes favoritos aún.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default VeterinarianSection;
