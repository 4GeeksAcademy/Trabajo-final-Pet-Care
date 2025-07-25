import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/UserProfile.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const DEFAULT_IMAGE =
  "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    foto: "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${BACKEND}/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg) throw new Error(data.msg);
        setUser(data);
        setForm({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          password: "",
          foto: data.foto || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mascotas_unsigned");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dvqbb7cjs/image/upload", {
        method: "POST",
        body: data,
      });

      const fileData = await res.json();
      setForm({ ...form, foto: fileData.secure_url });
    } catch (err) {
      setError("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND}/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al actualizar");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdated"));
      setMessage("Perfil actualizado correctamente");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="userprofile-loading">Cargando perfil...</div>;
  if (error) return <div className="userprofile-error">{error}</div>;

  return (
    <div className="userprofile-container">
      <Link
        to={currentUser?.is_admin ? "/admin-panel" : "/dashboard"}
        className="userprofile-backbtn"
      >
        ← {currentUser?.is_admin ? "Volver al panel de administrador" : "Volver al dashboard"}
      </Link>
      <div className="userprofile-card">
        <h2 className="userprofile-title">Perfil de usuario</h2>

        <div className="userprofile-img-container">
          <img
            className="userprofile-img"
            src={form.foto || DEFAULT_IMAGE}
            alt="Foto de perfil"
          />
        </div>

        {editing && (
          <>
            <label htmlFor="file-upload" className="userprofile-file-upload-btn">
              {uploading ? "Subiendo..." : "Cambiar foto de perfil"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="userprofile-file-input"
              disabled={uploading}
            />
          </>
        )}

        {!editing ? (
          <>
            <ul className="userprofile-list">
              <li className="userprofile-list-item">
                <b>Nombre:</b> {user.nombre}
              </li>
              <li className="userprofile-list-item">
                <b>Apellido:</b> {user.apellido}
              </li>
              <li className="userprofile-list-item">
                <b>Email:</b> {user.email}
              </li>
            </ul>
            <div className="userprofile-edit-button-container Editar">
              <button className="userprofile-edit-button" onClick={() => setEditing(true)}>
                Editar
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="userprofile-form">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nueva contraseña (opcional)"
            />
            <div className="userprofile-edit-button-container">
              <button className="userprofile-edit-button" type="submit">
                {uploading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                className="userprofile-edit-button"
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {message && <p className="userprofile-success">{message}</p>}
        {error && <p className="userprofile-error">{error}</p>}
      </div>

      <div className="userprofile-footer">
        <Footer />
      </div>
    </div>
  );
};

export default UserProfile;