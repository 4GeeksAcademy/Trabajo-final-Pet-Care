import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/UserDetails.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const DEFAULT_IMAGE =
  "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    fetchUserAndPets();
  }, [userId]);

  const fetchUserAndPets = async () => {
    setLoading(true);
    setError("");
    try {
      const [userRes, petsRes] = await Promise.all([
        fetch(`${BACKEND}/api/admin/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BACKEND}/api/admin/pets/filter?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userData = await userRes.json();
      const petsData = await petsRes.json();

      if (!userRes.ok) throw new Error(userData.msg || "Error al cargar usuario");
      if (!petsRes.ok) throw new Error("Error al cargar mascotas");

      setUser(userData);
      setEditableUser({
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        email: userData.email || "",
        is_admin: userData.is_admin,
        is_active: userData.is_active,
      });
      setPets(petsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND}/api/admin/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editableUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al guardar usuario");

      setUser(data);
      setActionMsg("Usuario actualizado correctamente");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/user/${userId}/toggle-active`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setUser((prev) => ({ ...prev, is_active: !prev.is_active }));
      setEditableUser((prev) => ({ ...prev, is_active: !prev.is_active }));
      setActionMsg(`Usuario ${data.user.is_active ? "activado" : "desactivado"} correctamente`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleAdmin = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/user/${userId}/toggle-admin`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setUser((prev) => ({ ...prev, is_admin: !prev.is_admin }));
      setEditableUser((prev) => ({ ...prev, is_admin: !prev.is_admin }));
      setActionMsg(
        `Rol de administrador ${data.user.is_admin ? "concedido" : "revocado"} correctamente`
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePetActive = async (petId) => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/pet/${petId}/toggle_active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;

      const updatedPet = await res.json();
      setPets((prev) =>
        prev.map((p) => (p.id === updatedPet.id ? { ...p, is_active: updatedPet.is_active } : p))
      );
    } catch (err) {
      console.error("Error al cambiar estado de la mascota", err);
    }
  };

  useEffect(() => {
    if (actionMsg) {
      const timer = setTimeout(() => setActionMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMsg]);

  if (loading) return <div className="userdetails-loading">Cargando perfil del usuario...</div>;
  if (error) return <div className="userdetails-error">{error}</div>;
  if (!user || !editableUser) return null;

  return (
    <div className="userdetails-container">
      <Link to="/admin-panel" className="userdetails-backbtn">
        ← Volver al panel
      </Link>
      <div className="userdetails-card">
        <h2 className="userdetails-title">Detalle del Usuario</h2>

        <div className="userdetails-img-container">
          <img
            className="userdetails-img"
            src={user.foto || DEFAULT_IMAGE}
            alt="Foto de perfil"
          />
        </div>

        <ul className="userdetails-list">
          <li className="userdetails-list-item">
            <b>Nombre:</b>{" "}
            <input
              type="text"
              value={editableUser.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
            />
          </li>
          <li className="userdetails-list-item">
            <b>Apellido:</b>{" "}
            <input
              type="text"
              value={editableUser.apellido}
              onChange={(e) => handleInputChange("apellido", e.target.value)}
            />
          </li>
          <li className="userdetails-list-item">
            <b>Email:</b>{" "}
            <input
              type="email"
              value={editableUser.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </li>
          <li className="userdetails-list-item"><b>Activo:</b> {user.is_active ? "Sí" : "No"}</li>
          <li className="userdetails-list-item"><b>Admin:</b> {user.is_admin ? "Sí" : "No"}</li>
        </ul>

        <div className="userdetails-edit-button-container mt-3">
          <button className="userdetails-edit-button" onClick={handleSaveChanges} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button className="userdetails-edit-button" onClick={handleToggleActive}>
            {user.is_active ? "Desactivar usuario" : "Activar usuario"}
          </button>
          <button className="userdetails-edit-button" onClick={handleToggleAdmin}>
            {user.is_admin ? "Revocar admin" : "Conceder admin"}
          </button>
        </div>

        {actionMsg && <p className="userdetails-success">{actionMsg}</p>}
      </div>

      <div className="userdetails-card mt-4">
        <h3 className="userdetails-title">Mascotas registradas</h3>
        {pets.length === 0 ? (
          <p>Este usuario no tiene mascotas registradas.</p>
        ) : (
          <ul className="userdetails-list">
            {pets.map((p) => (
              <li key={p.id} className="userdetails-list-item">
                {p.nombre} – {p.especie} ({p.raza}) – {p.is_active ? "Activa" : "Inactiva"}
                <div className="d-flex gap-2 mt-2 justify-content-center flex-wrap">
                  <button
                    className="btn btn-sm btn-outline-main"
                    onClick={() => navigate(`/pets/${p.id}`)}
                  >
                    Ver detalle
                  </button>
                  <button
                    className="btn btn-sm btn-main"
                    onClick={() => togglePetActive(p.id)}
                  >
                    {p.is_active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="userdetails-footer">
        <Footer />
      </div>
    </div>
  );
};

export default UserDetails;