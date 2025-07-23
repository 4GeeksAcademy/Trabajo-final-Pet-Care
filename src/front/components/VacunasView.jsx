import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const VacunasView = ({ petId, pet, user }) => {
    const [vacunas, setVacunas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPagarModal, setShowPagarModal] = useState(false);
    const [showExitoModal, setShowExitoModal] = useState(false);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        fecha_aplicacion: ""
    });
    const [carnetPagado, setCarnetPagado] = useState(false);

    const carnetKey = user && petId ? `carnetPagado_${user.id}_${petId}` : null;

    const location = useLocation();
    useEffect(() => {
        if (carnetKey) {
            setCarnetPagado(localStorage.getItem(carnetKey) === "ok");
        }
        const query = new URLSearchParams(location.search);
        if (query.get("carnet_paid") === "ok" && carnetKey && !localStorage.getItem(carnetKey)) {
            setShowExitoModal(true);
            localStorage.setItem(carnetKey, "ok");
            setCarnetPagado(true);
           
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [location.search, carnetKey]);

    const fetchVacunas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/mascotas/${petId}/vacunas`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setVacunas(data);
        } catch (err) {
            setVacunas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacunas();
    }, [petId, showModal]);

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/mascotas/${petId}/vacunas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });
        setShowModal(false);
        setForm({ nombre: "", descripcion: "", fecha_aplicacion: "" });
    };

    const handleDeleteVacuna = async (vacunaId) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta vacuna?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/vacunas/${vacunaId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Error al eliminar vacuna");
            setVacunas((prev) => prev.filter((v) => v.id !== vacunaId));
            alert("Vacuna eliminada correctamente");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDescargarCarnet = () => {
        setShowPagarModal(true);
    };

    const handleStripePagoCarnet = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/stripe/carnet-checkout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ pet_id: petId })
                }
            );
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Error al iniciar el pago");
            }
        } catch (err) {
            alert("Error al conectar con Stripe");
        }
    };

    const descargarCarnetPDF = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/pets/${petId}/carnet-pdf`
        );
        if (!response.ok) {
            alert("No se pudo descargar el carnet. Intenta de nuevo.");
            return;
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "carnet_vacunacion.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h4>💉 Vacunas registradas</h4>
                <button
                    className="btn btn-main"
                    onClick={() => setShowModal(true)}
                >
                    + Añadir vacuna
                </button>
            </div>

            {/* Listado de vacunas */}
            <div>
                {loading ? (
                    <p>Cargando...</p>
                ) : vacunas.length === 0 ? (
                    <div className="alert alert-secondary">No hay vacunas registradas.</div>
                ) : (
                    <ul className="list-group mb-4">
                        {vacunas.map((vacuna) => (
                            <li key={vacuna.id} className="list-group-item d-flex justify-content-between align-items-center mb-2 rounded shadow-sm">
                                <div>
                                    <strong>{vacuna.nombre}</strong>
                                    <span className="text-muted"> – {vacuna.descripcion || "Sin observaciones"}</span>
                                    <br />
                                    <small className="text-muted">Aplicada el: {vacuna.fecha_aplicacion?.split("T")[0] || vacuna.fecha_aplicacion}</small>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteVacuna(vacuna.id)}
                                    title="Eliminar"
                                >
                                    🗑
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Botón Carnet Digital */}
            <div className="carnet-digital-section mt-3">
                {carnetPagado ? (
                    <button
                        className="btn btn-success w-100"
                        onClick={descargarCarnetPDF}
                    >
                        Descargar Carnet de Vacunación PDF
                    </button>
                ) : (
                    <button
                        className="btn btn-outline-main w-100"
                        onClick={handleDescargarCarnet}
                    >
                        <svg width="28" height="28" fill="none" viewBox="0 0 42 42">
                            <rect width="42" height="42" rx="10" fill="#F2F2F7" />
                            <path d="M21 11v14m0 0l-5-5m5 5l5-5" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="14" y="31" width="14" height="2.5" rx="1.25" fill="#8B5CF6" />
                        </svg>
                        <span style={{ fontWeight: 600, color: "#6D28D9", fontSize: 18 }}> Descargar Carnet de Vacunación  </span>
                    </button>
                )}
                {showPagarModal && (
                    <ModalPagoCarnet
                        onClose={() => setShowPagarModal(false)}
                        onPagar={handleStripePagoCarnet}
                    />
                )}
            </div>

            {/* Modal Éxito tras pagar */}
            {showExitoModal && (
                <ModalExitoCarnet
                    onClose={() => setShowExitoModal(false)}
                    onDescargar={descargarCarnetPDF}
                />
            )}

            {/* Modal Añadir Vacuna */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: "#0008" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header">
                                <h5 className="modal-title">Añadir vacuna</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            className="form-control"
                                            value={form.nombre}
                                            onChange={e => setForm({ ...form, nombre: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Descripción</label>
                                        <input
                                            className="form-control"
                                            value={form.descripcion}
                                            onChange={e => setForm({ ...form, descripcion: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha de aplicación</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={form.fecha_aplicacion}
                                            onChange={e => setForm({ ...form, fecha_aplicacion: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-main">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ModalPagoCarnet = ({ onClose, onPagar }) => (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "#0008" }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 p-4 text-center">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <svg width="32" height="32" fill="none" viewBox="0 0 42 42">
                        <rect width="42" height="42" rx="10" fill="#F2F2F7" />
                        <rect x="10" y="13" width="22" height="16" rx="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                        <circle cx="16" cy="21" r="3" fill="#E9D5FF" stroke="#8B5CF6" strokeWidth="2" />
                        <rect x="21" y="19" width="9" height="1.7" rx="0.85" fill="#C4B5FD" />
                        <rect x="21" y="23" width="9" height="1.7" rx="0.85" fill="#C4B5FD" />
                    </svg>
                    <span style={{ fontWeight: 700, color: "#3c276a", fontSize: 22 }}>Carnet de Vacunación</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "220px",
                        width: "100%",
                        marginBottom: "18px"
                    }}
                >
                    <img
                        src="/img/bongo.png"
                        alt="Ejemplo carnet digital"
                        style={{
                            maxWidth: "180px",
                            borderRadius: "14px",
                            boxShadow: "0 2px 16px #c2c2ee77",
                            display: "block",
                            margin: "0 auto",
                            filter: "blur(2px)"
                        }}
                    />
                </div>
                <p className="mt-3 mb-2">
                    Para obtener el carnet digital de vacunación en PDF debes cancelar <b>1 USD</b> (pago único).<br />
                    Al pagar, tendrás acceso al carnet para descargarlo e imprimirlo.
                </p>
                <button className="btn btn-main w-100" onClick={onPagar}>
                    Sí, quiero mi carnet digital
                </button>
                <button className="btn btn-link text-purple-dark mt-2" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    </div>
);

const ModalExitoCarnet = ({ onClose, onDescargar }) => (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "#0008" }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 p-4 text-center">
                <h4 className="mb-3" style={{ color: "#6D28D9" }}>¡Pago exitoso!</h4>
                <img
                    src="/img/bongo.png"
                    alt="Carnet"
                    style={{
                        maxWidth: "140px",
                        borderRadius: "14px",
                        boxShadow: "0 2px 16px #c2c2ee77",
                        margin: "0 auto 18px auto",
                        display: "block"
                    }}
                />
                <p className="mb-3">
                    ¡Ahora puedes descargar el carnet digital de vacunación de tu mascota!
                </p>
                <button className="btn btn-success w-100" onClick={onDescargar}>
                    Descargar Carnet en PDF
                </button>
                <button className="btn btn-link text-purple-dark mt-2" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    </div>
);

export default VacunasView;
