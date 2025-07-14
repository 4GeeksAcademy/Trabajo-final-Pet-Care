import React, { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import "../../styles/veterinarian.css";

const containerStyle = { width: "100%", height: "350px" };

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function VeterinarianSection() {
  const [coords, setCoords] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const token = localStorage.getItem("token") || "";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setCoords({ lat: coords.latitude, lng: coords.longitude }),
      () => console.warn("Ubicación denegada")
    );
  }, []);

  const fetchClinics = useCallback(() => {
    if (!coords || !isLoaded) return;
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.nearbySearch(
      { location: coords, radius: 5000, type: "veterinary_care" },
      (results, status) => {
        if (status === "OK" && results) setClinics(results.slice(0, 7));
      }
    );
  }, [coords, isLoaded]);
  useEffect(fetchClinics, [fetchClinics]);

  useEffect(() => {
    if (!token) return;
    fetch(`${BACKEND}api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFavorites)
      .catch(console.error);
  }, [token]);

  const handleMarkerClick = (clinic) => {
    setSelected(clinic);
    new window.google.maps.places.PlacesService(
      document.createElement("div")
    ).getDetails(
      {
        placeId: clinic.place_id,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "website",
          "geometry",
        ],
      },
      (place, status) => {
        if (status === "OK") setDetails(place);
      }
    );
  };

  const toggleFavorite = async (place) => {
    if (!token) {
      alert("Debes iniciar sesión para guardar favoritos");
      return;
    }
    const placeId = place.place_id || (selected && selected.place_id);
    if (!placeId) {
      alert("No se encontró el place_id del veterinario.");
      return;
    }
    const exists = favorites.some((f) => f.place_id === placeId);

    try {
      if (exists) {
        await fetch(
          `${BACKEND}api/favorites/${placeId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavorites((f) =>
          f.filter((fav) => fav.place_id !== placeId)
        );
      } else {
        const res = await fetch(
          `${BACKEND}api/favorites`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              place_id: placeId,
              name: place.name,
              address: place.formatted_address,
              phone: place.formatted_phone_number || null,
              website: place.website || null,
            }),
          }
        );
        const newFav = await res.json();
        setFavorites((f) => [...f, newFav]);
      }
    } catch (e) {
      console.error(e);
      alert("Error al modificar favoritos");
    } finally {
      setSelected(null);
      setDetails(null);
    }
  };

  return (
    <section className="veterinarian-section container my-5 p-4 rounded">
      <h2 className="section-title mb-4">Veterinarios cercanos a ti </h2>
      <div className="row gx-4">
        <div className="col-lg-8 mb-4">
          {coords && isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={coords}
              zoom={13}
            >
              <Marker position={coords} label="Yo" />
              {clinics
                .filter(c => c.geometry && c.geometry.location)
                .map((c) => (
                  <Marker
                    key={c.place_id}
                    position={{
                      lat: c.geometry.location.lat(),
                      lng: c.geometry.location.lng(),
                    }}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new window.google.maps.Size(32, 32),
                    }}
                    onClick={() => handleMarkerClick(c)}
                  />
                ))}

              {selected && details && (
                <InfoWindow
                  position={{
                    lat: details.geometry.location.lat(),
                    lng: details.geometry.location.lng(),
                  }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div className="info-window p-3">
                    <h5 className="fw-bold mb-2">{details.name}</h5>
                    <p className="small mb-1">
                      📍 {details.formatted_address}
                    </p>
                    {details.formatted_phone_number && (
                      <p className="small mb-1">
                        📞 {details.formatted_phone_number}
                      </p>
                    )}
                    {details.website && (
                      <p className="small mb-2">
                        🌐{" "}
                        <a
                          href={details.website}
                          target="_blank"
                          rel="noreferrer"
                          className="info-link"
                        >
                          {new URL(details.website).hostname}
                        </a>
                      </p>
                    )}
                    <button
                      className={`btn w-100 btn-sm ${favorites.some((f) => f.place_id === details.place_id)
                          ? "btn-outline-danger"
                          : "btn-success"
                        }`}
                      onClick={() => toggleFavorite(details)}
                    >
                      {favorites.some((f) => f.place_id === details.place_id)
                        ? "Eliminar favorito"
                        : "Guardar favorito"}
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <p>Cargando mapa…</p>
          )}
        </div>

        <div className="col-lg-4">
          <h4 className="favorites-title">Favoritos</h4>
          {favorites.length ? (
            <div className="favorites-list">
              {favorites.map((f) => (
                <div key={f.place_id} className="favorite-card mb-3 p-3">
                  <div>
                    <strong>{f.name}</strong>
                    <p className="small mb-1">{f.address}</p>
                    {f.phone && <p className="small mb-1">📞 {f.phone}</p>}
                    {f.website && (
                      <p className="small mb-2">
                        🌐{" "}
                        <a
                          href={f.website}
                          target="_blank"
                          rel="noreferrer"
                          className="info-link"
                        >
                          {new URL(f.website).hostname}
                        </a>
                      </p>
                    )}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => toggleFavorite(f)}
                  >
                    Eliminar favorito
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">Aún no tienes favoritos.</p>
          )}
        </div>
      </div>
    </section>
  );
}