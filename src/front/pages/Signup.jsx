import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
    setSuccessMessage("");
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "El nombre es obligatorio";
    if (!form.lastName.trim())  errs.lastName  = "El apellido es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email inválido";
    if (form.password.length < 6)
      errs.password = "Mínimo 6 caracteres";
    if (form.confirm !== form.password)
      errs.confirm = "Las contraseñas no coinciden";
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const clientErrs = validate();
    if (Object.keys(clientErrs).length) {
      setErrors(clientErrs);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre:   form.firstName,
            apellido: form.lastName,
            email:    form.email,
            password: form.password
          })
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.msg || "Error al registrarse");
        return;
      }

      setSuccessMessage("¡Registro exitoso! Redireccionando...🐾");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setServerError("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm" style={{ maxWidth: 400, width: "100%", marginTop: "70px" }}>
        <h2 className="card-title text-center mb-4">Crea tu cuenta</h2>
        { serverError && (
          <div className="alert alert-danger">{serverError}</div>
        ) }
        { successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        ) }
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              name="firstName"
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              value={form.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              name="lastName"
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              value={form.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              name="confirm"
              className={`form-control ${errors.confirm ? "is-invalid" : ""}`}
              value={form.confirm}
              onChange={handleChange}
            />
            {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
          </div>
          <div style={{marginLeft: "50px"}}>
          <button type="submit" className="btn btn-main w-100">Registrarse</button></div>
        </form>
        <p className="text-center mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
