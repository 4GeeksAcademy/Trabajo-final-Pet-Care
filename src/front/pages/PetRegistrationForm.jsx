import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import './PetRegistrationForm.css';

const PetRegistrationForm = () => {
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
  const stepsCount = 4;

  const handleNext = () => {
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
    setMensaje(null);
    setStep(s => Math.min(s + 1, stepsCount - 1));
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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/pets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(mascota)
        }
      );
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

  return (
    <div className="AppLayout">
      <div className="fondo-pet">
        <div className="DogImageContainerOutside">
          <img
            className="DogImageOutside"
            src="https://static.vecteezy.com/system/resources/thumbnails/022/983/455/small_2x/dog-and-cat-free-illustration-icons-free-png.png"
            alt="Perrito especial"
          />
        </div>

        <div className="FormCard">
          <h2 className="Titulo">¡Registra tu Mascota!</h2>
          <p className="Sub-titulo">
            Añade a tu compañero/a a nuestra familia
          </p>

          <form onSubmit={e => e.preventDefault()}>
            <div className="steps-wrapper">
              <div
                className="steps"
                style={{ transform: `translateX(-${step * 100}%)` }}
              >
                {/* Slide 1 */}
                <div className="step">
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
                    <option value="" disabled>
                      Selecciona especie
                    </option>
                    <option value="Perro">Perro 🐶</option>
                    <option value="Gato">Gato 🐱</option>
                    <option value="Ave">Ave 🐦</option>
                    <option value="Pez">Pez 🐠</option>
                    <option value="Reptil">Reptil 🦎</option>
                    <option value="Roedor">Roedor 🐭</option>
                    <option value="Conejo">Conejo 🐰</option>
                    <option value="Otro">Otro ❓</option>
                  </select>
                </div>

                {/* Slide 2 */}
                <div className="step">
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

                {/* Slide 3 */}
                <div className="step">
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
                    <option value="" disabled>
                      Selecciona sexo
                    </option>
                    <option value="Macho">Macho ♂️</option>
                    <option value="Hembra">Hembra ♀️</option>
                  </select>
                </div>

                {/* Slide 4 */}
                <div className="step">
                  <label className="Categoria">📷 Foto (URL)</label>
                  <input
                    className="Input Foto"
                    type="text"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={foto}
                    onChange={e => setFoto(e.target.value)}
                  />
                  <p className="Aviso">Puedes agregar la foto luego.</p>
                </div>
              </div>
            </div>

            {mensaje && <p className="Mensaje">{mensaje}</p>}

            <div className="BotonContainer">
              {step < stepsCount - 1 ? (
                <button
                  type="button"
                  className="Boton"
                  onClick={handleNext}
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  className="Boton"
                  onClick={handleSubmit}
                >
                  Registrar Mascota
                </button>
              )}
            </div>
          </form>

          <div className="progress-dots">
            {Array.from({ length: stepsCount }).map((_, i) => (
              <span
                key={i}
                className={`dot ${i === step ? 'active' : ''}`}
              />
            ))}
          </div>

          <p className="Nota">
            Nota: todos los campos con <strong className="Apostrofe">*</strong> son
            obligatorios.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PetRegistrationForm;
