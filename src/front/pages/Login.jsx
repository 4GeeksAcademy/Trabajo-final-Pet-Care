import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.status === 403) {
        const mensaje = data.message || "Tu cuenta está desactivada";
        setError(mensaje);
        return;
      }

      if (!res.ok) {
        const mensaje = data.msg || data.message || "Credenciales inválidas";
        setError(mensaje);
        return;
      }

      const { token, user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("userUpdated"));

      if (user.is_admin) {
        navigate("/admin-panel");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2
          className="card-title text-center mb-4"
          style={{ fontFamily: "var(--ff-headings)" }}
        >
          Inicia sesión
        </h2>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-main w-100">
            Entrar
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/signup" className="link-primary">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}
