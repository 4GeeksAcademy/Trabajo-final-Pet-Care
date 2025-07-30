import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/dashboard.css";
import "../styles/admin-panel.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState("");
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [petError, setPetError] = useState("");
  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    if (!parsedUser.is_admin) {
      navigate("/dashboard");
      return;
    }
    setLoadingInit(false);
  }, [token, navigate]);

  useEffect(() => {
    if (!user || !user.is_admin) return;
    if (tab === "users") fetchUsers();
    if (tab === "pets") fetchPets();
  }, [tab, user]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserError("");
    try {
      const res = await fetch(`${BACKEND}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setUserError("No se pudieron cargar los usuarios");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchPets = async () => {
    setLoadingPets(true);
    setPetError("");
    try {
      const res = await fetch(`${BACKEND}/api/admin/pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar mascotas");
      const data = await res.json();
      setPets(data);
    } catch (e) {
      setPetError("No se pudieron cargar las mascotas");
    } finally {
      setLoadingPets(false);
    }
  };

  const toggleUserActive = async (u) => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/user/${u.id}/toggle_active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: data.is_active } : x)));
    } catch (_) {}
  };

  const togglePetActive = async (p) => {
    try {
      const res = await fetch(`${BACKEND}/api/admin/pet/${p.id}/toggle_active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setPets((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: data.is_active } : x)));
    } catch (_) {}
  };

  const editUserField = async (id, field, value) => {
    const body = { [field]: value };
    try {
      const res = await fetch(`${BACKEND}/api/admin/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? data : u)));
    } catch (_) {}
  };

  const editPetField = async (id, field, value) => {
    const body = { [field]: value };
    try {
      const res = await fetch(`${BACKEND}/api/admin/pet/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) return;
      const data = await res.json();
      setPets((prev) => prev.map((p) => (p.id === id ? data : p)));
    } catch (_) {}
  };

  const handleInlineChange = (setter, current, id, field, value, saveFn) => {
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    saveFn(id, field, value);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  if (loadingInit) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <img
          src="https://th.bing.com/th/id/R.1d07d3bf5c6e31cc81ea32d42e0ca896?rik=fyCMQz18dEzp%2bA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-6l_paC5jSAA%2fUUXd-ZujCPI%2fAAAAAAAAC2I%2f74BZTvZkKds%2fs1600%2fperro.gif"
          alt="Cargando…"
          style={{ width: 200 }}
        />
      </div>
    );
  }

  if (!user || !user.is_admin) return null;

  return (
    <div className="d-flex flex-column min-vh-100 admin-panel-wrapper">
      <div className="admin-panel container py-5 mt-5 flex-grow-1">
        <div className="admin-panel__header mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h1 className="admin-panel__title">
            Panel de Administración – <span className="text-purple-mid">{user.nombre}</span>
          </h1>
          <div className="admin-panel__tabs d-flex gap-2" role="group">
            <button
              type="button"
              className={`btn btn-outline-main ${tab === "users" ? "active" : ""}`}
              onClick={() => setTab("users")}
            >
              Usuarios
            </button>
            <button
              type="button"
              className={`btn btn-outline-main ${tab === "pets" ? "active" : ""}`}
              onClick={() => setTab("pets")}
            >
              Mascotas
            </button>
          </div>
        </div>

        {tab === "users" && (
          <section className="admin-panel__section">
            {userError && <div className="alert alert-danger py-2">{userError}</div>}
            {loadingUsers ? (
              <div className="text-center my-5">
                <img
                  src="https://i.pinimg.com/originals/1d/07/d3/1d07d3bf5c6e31cc81ea32d42e0ca896.gif"
                  alt="Cargando usuarios…"
                  style={{ width: 200 }}
                />
                <p>Cargando usuarios…</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Email</th>
                      <th>Activo</th>
                      <th>Admin</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className={!u.is_active ? "table-warning" : ""}>
                        <td>{u.id}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={u.nombre || ""}
                            onChange={(e) =>
                              handleInlineChange(setUsers, users, u.id, "nombre", e.target.value, editUserField)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={u.apellido || ""}
                            onChange={(e) =>
                              handleInlineChange(setUsers, users, u.id, "apellido", e.target.value, editUserField)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            value={u.email || ""}
                            onChange={(e) =>
                              handleInlineChange(setUsers, users, u.id, "email", e.target.value, editUserField)
                            }
                          />
                        </td>
                        <td>
                          <span className={`badge rounded-pill ${u.is_active ? "bg-success" : "bg-secondary"}`}>
                            {u.is_active ? "Sí" : "No"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${u.is_admin ? "bg-purple-admin" : "bg-light text-purple-mid"}`}
                          >
                            {u.is_admin ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="d-flex align-items-center gap-2">
                          {!u.is_admin && (
                            <button
                              className="btn btn-sm btn-outline-main"
                              onClick={() => editUserField(u.id, "is_admin", true)}
                            >
                              Hacer admin
                            </button>
                          )}
                          {u.is_admin && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              style={{ padding: "0.5rem 1.2rem", borderRadius: "24px", width: "250px" }}
                              onClick={() => editUserField(u.id, "is_admin", false)}
                            >
                              Quitar admin
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline-main"
                            onClick={() => navigate(`/admin/user/${u.id}`)}
                          >
                            Ver detalle
                          </button>
                          <button
                            className="btn btn-sm btn-main"
                            onClick={() => toggleUserActive(u)}
                          >
                            {u.is_active ? "Desactivar" : "Activar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "pets" && (
          <section className="admin-panel__section">
            {petError && <div className="alert alert-danger py-2">{petError}</div>}
            {loadingPets ? (
              <div className="text-center my-5">
                <img
                  src="https://i.pinimg.com/originals/1d/07/d3/1d07d3bf5c6e31cc81ea32d42e0ca896.gif"
                  alt="Cargando mascotas…"
                  style={{ width: 200 }}
                />
                <p>Cargando mascotas…</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Especie</th>
                      <th>Raza</th>
                      <th>Peso</th>
                      <th>Sexo</th>
                      <th>Usuario</th>
                      <th>Activo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((p) => (
                      <tr key={p.id} className={!p.is_active ? "table-warning" : ""}>
                        <td>{p.id}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={p.nombre || ""}
                            onChange={(e) =>
                              handleInlineChange(setPets, pets, p.id, "nombre", e.target.value, editPetField)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={p.especie || ""}
                            onChange={(e) =>
                              handleInlineChange(setPets, pets, p.id, "especie", e.target.value, editPetField)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={p.raza || ""}
                            onChange={(e) =>
                              handleInlineChange(setPets, pets, p.id, "raza", e.target.value, editPetField)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            className="form-control form-control-sm"
                            value={p.peso ?? ""}
                            onChange={(e) =>
                              handleInlineChange(setPets, pets, p.id, "peso", e.target.value, editPetField)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={p.sexo || ""}
                            onChange={(e) =>
                              handleInlineChange(setPets, pets, p.id, "sexo", e.target.value, editPetField)
                            }
                          />
                        </td>
                        <td>{p.user_id}</td>
                        <td>
                          <span className={`badge rounded-pill ${p.is_active ? "bg-success" : "bg-secondary"}`}>
                            {p.is_active ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-main"
                            onClick={() => navigate(`/pets/${p.id}`)}
                          >
                            Ver detalle
                          </button>
                          <button className="btn btn-sm btn-main" onClick={() => togglePetActive(p)}>
                            {p.is_active ? "Desactivar" : "Activar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}