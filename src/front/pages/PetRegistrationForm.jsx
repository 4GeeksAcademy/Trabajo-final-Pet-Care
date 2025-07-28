import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PetRegistrationForm.css';

const pasos = [
  { label: "Datos básicos" },
  { label: "Características" },
  { label: "Sexo y nacimiento" },
  { label: "Subir foto" },
  { label: "Confirmar y registrar" }
];

export default function PetRegistrationForm() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token') || !localStorage.getItem('user')) {
      navigate('/login');
    }
  }, [navigate]);

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [peso, setPeso] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('');
  const [foto, setFoto] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [step, setStep] = useState(0);
  const stepsCount = 5;

  const handleNext = () => {
    setMensaje(null);
    // Validaciones según paso
    if (step === 0 && (!nombre.trim() || !especie)) {
      setMensaje('Completa nombre y especie.');
      return;
    }
    if (step === 1 && (!raza.trim() || !peso.trim())) {
      setMensaje('Completa raza y peso.');
      return;
    }
    if (step === 2 && (!fechaNacimiento || !sexo)) {
      setMensaje('Completa fecha de nacimiento y sexo.');
      return;
    }
    setStep((s) => Math.min(s + 1, stepsCount - 1));
  };

  const handlePrev = () => {
    setMensaje(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleGoDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || !user.id) {
      setMensaje('Inicia sesión primero.');
      return;
    }
    if (!nombre || !especie || !raza || !peso || !fechaNacimiento || !sexo) {
      setMensaje('Faltan campos obligatorios.');
      return;
    }
    const mascota = {
      nombre,
      especie,
      raza,
      peso: parseFloat(peso),
      foto,
      fecha_nacimiento: fechaNacimiento,
      sexo,
      user_id: user.id
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(mascota)
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje(data.msg || '¡Mascota registrada!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMensaje(data.msg || 'Error al registrar.');
      }
    } catch {
      setMensaje('Error de conexión.');
    }
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mascotas_unsigned');
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dvqbb7cjs/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setFoto(data.secure_url);
        setMensaje(null);
      } else {
        setMensaje('Error al subir imagen.');
      }
    } catch {
      setMensaje('Error de conexión al subir imagen.');
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="AppLayout">
      <div className="fondo-pet">
        <div className="FormCard-expanded">
          <button
            className="BotonBackDashboard"
            onClick={handleGoDashboard}
            type="button"
            title="Volver al Dashboard"
          >
            ← Dashboard
          </button>
          {/* Barra de pasos tipo wizard */}
          <div className="StepperContainer mt-3">
            {pasos.map((paso, idx) => (
              <div
                key={idx}
                className={
                  'StepCircleContainer' +
                  (step === idx ? ' active' : '') +
                  (step > idx ? ' completed' : '')
                }
              >
                <div className="StepCircle">
                  {step > idx ? (
                    <span className="CheckIcon">✔</span>
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="StepLabel">{paso.label}</div>
                {idx < pasos.length - 1 && <div className="StepLine" />}
              </div>
            ))}
          </div>
          <h2 className="Titulo">¡Registra tu Mascota!</h2>
          <p className="Sub-titulo">Añade a tu compañero/a a nuestra familia</p>
          <form onSubmit={e => e.preventDefault()} className="FormSlideContainer">
            {/* Slides */}
            <div className="steps-wrapper">
              {/* Slide 1 */}
              {step === 0 && (
                <div className="step active">
                  <label className="Categoria">🏷️ Nombre *</label>
                  <input
                    className="Input"
                    type="text"
                    placeholder="ej: Firulais"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                  />
                  <label className="Categoria">🐾 Especie *</label>
                  <select
                    className="Select"
                    value={especie}
                    onChange={e => setEspecie(e.target.value)}
                  >
                    <option value="" disabled>Selecciona especie</option>
                    <option value="Perro">Perro 🐶</option>
                    <option value="Gato">Gato 🐱</option>
                  </select>
                </div>
              )}
              {/* Slide 2 */}
              {step === 1 && (
                <div className="step active">
                  <label className="Categoria">🧬 Raza *</label>
                  <input
                    className="Input"
                    type="text"
                    placeholder="ej: Golden Retriever"
                    value={raza}
                    onChange={e => setRaza(e.target.value)}
                  />
                  <label className="Categoria">⚖️ Peso (kg) *</label>
                  <input
                    className="Input"
                    type="number"
                    placeholder="ej: 5.5"
                    value={peso}
                    onChange={e => setPeso(e.target.value)}
                  />
                </div>
              )}
              {/* Slide 3 */}
              {step === 2 && (
                <div className="step active">
                  <label className="Categoria">📅 Fecha de Nac. *</label>
                  <input
                    className="Input"
                    type="date"
                    value={fechaNacimiento}
                    onChange={e => setFechaNacimiento(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <label className="Categoria">👫 Sexo *</label>
                  <select
                    className="Select"
                    value={sexo}
                    onChange={e => setSexo(e.target.value)}
                  >
                    <option value="" disabled>Selecciona sexo</option>
                    <option value="Macho">Macho ♂️</option>
                    <option value="Hembra">Hembra ♀️</option>
                  </select>
                </div>
              )}
              {/* Slide 4 */}
              {step === 3 && (
                <div className="step active">
                  <label className="Categoria">📷 Foto (opcional)</label>
                  <label htmlFor="file-upload" className="CustomFileButton">
                    Elegir archivo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="Input Foto"
                  />
                  {foto && (
                    <div className="VistaPreviaContainer">
                      <img src={foto} alt="Vista previa" className="VistaPrevia" />
                    </div>
                  )}
                  <p className="Aviso">Puedes agregar la foto luego.</p>
                </div>
              )}
              {/* Slide 5: Confirmación */}
              {step === 4 && (
                <div className="step active confirm-slide">
                  <div className="ConfirmCard">
                    <div className="ConfirmCardHeader">
                      🐾 Revisa los datos de <strong>{nombre}</strong> antes de registrar
                    </div>
                    <div className="ConfirmRow">
                      <span className="ConfirmLabel">🐶 Nombre:</span>
                      <span className="ConfirmValue">{nombre}</span>
                    </div>
                    <div className="ConfirmRow">
                      <span className="ConfirmLabel">🦴 Especie:</span>
                      <span className="ConfirmValue">{especie}</span>
                    </div>
                    <div className="ConfirmRow">
                      <span className="ConfirmLabel">🧬 Raza:</span>
                      <span className="ConfirmValue">{raza}</span>
                    </div>
                    <div className="ConfirmRow">
                      <span className="ConfirmLabel">⚖️ Peso:</span>
                      <span className="ConfirmValue">{peso} kg</span>
                    </div>
                    <div className="ConfirmRow">
                      <span className="ConfirmLabel">📅 Nacimiento:</span>
                      <span className="ConfirmValue">{fechaNacimiento}</span>
                    </div>
                    <div className="ConfirmRow">
                      <span className="ConfirmLabel">👫 Sexo:</span>
                      <span className="ConfirmValue">{sexo}</span>
                    </div>
                    <div className="ConfirmRow">
                      <span className="ConfirmLabel">📷 Foto:</span>
                      {foto ? (
                        <img src={foto} alt="Foto mascota" className="ConfirmPetPhoto" />
                      ) : (
                        <span className="ConfirmNoPhoto">No agregada</span>
                      )}
                    </div>
                  </div>
                  <p className="AvisoConfirm">Revisa los datos antes de registrar.</p>
                </div>
              )}
            </div>
            {mensaje && <p className="Mensaje">{mensaje}</p>}
            <div className="BotonContainer">
              {step > 0 && (
                <button
                  type="button"
                  className="Boton BotonAtras"
                  onClick={handlePrev}
                >
                  ← Atrás
                </button>
              )}
              {step < stepsCount - 1 && (
                <button
                  type="button"
                  className="Boton BotonSiguiente"
                  onClick={handleNext}
                >
                  Siguiente →
                </button>
              )}
              {step === stepsCount - 1 && (
                <button
                  type="button"
                  className="Boton BotonRegistrar"
                  onClick={handleSubmit}
                >
                  Registrar Mascota
                </button>
              )}
            </div>
          </form>
          <div className="progress-dots">
            {pasos.map((p, i) => (
              <span
                key={i}
                className={`dot ${i === step ? 'active' : ''}`}
                title={p.label}
              />
            ))}
          </div>
          <p className="Nota">
            Nota: todos los campos con <strong className="Apostrofe">*</strong> son obligatorios.
          </p>
        </div>
      </div>
    </div>
  );
}

