import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PetRegistrationForm.css';
const PetRegistrationForm = () => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [peso, setPeso] = useState('');
  const [foto, setFoto] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      navigate('/login');
    }
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();


    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const user_id = user?.id;

    if (!user_id || !token) {
      setMensaje('Debes iniciar sesión para registrar una mascota.');
      return;
    }

    if (!nombre || !especie || !raza || !peso) {
      setMensaje('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const mascota = {
      nombre,
      especie,
      raza,
      peso: parseFloat(peso),
      foto,
      user_id: user_id
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mascota),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.msg || 'Mascota registrada con éxito');
        setTimeout(() => {
          navigate('/dashboard'); // o "/dashboard" según tu estructura
        }, 1500);
      } else {
        setMensaje(data.msg || 'Error al registrar mascota');
      }
    } catch (error) {
      setMensaje('Error de conexión al servidor');
      console.error(error);
    }
  };

  return (
    <div className="fondo-pet">
      <img
        src="https://media.tenor.com/FFL1QxcDF64AAAAi/dog-cute.gif"
        alt="Perrito corriendo"
        className="DogRunner"
      />
      <div className="FormCard">
        <div className="Titulo">¡Registra tu Mascota!</div>
        <div className="Sub-titulo">Añade a tu compañero/a a nuestra familia</div>

        <form onSubmit={handleSubmit}>
          <div className="Inputs">
            <div className="Categoria">🏷️ Nombre de la mascota *</div>

            <input
              className="Input"
              type="text"
              placeholder="ej: Firulais, Michi, Rex..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <div className="Categoria">🐾 Especie *</div>

            <select
              className="Select"
              required
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
            >
              <option value="" disabled hidden>Selecciona una especie</option>
              <option value="Perro">Perro 🐶</option>
              <option value="Gato">Gato 🐱</option>
              <option value="Ave">Ave 🐦</option>
              <option value="Pez">Pez 🐠</option>
              <option value="Reptil">Reptil 🦎</option>
              <option value="Roedor">Roedor 🐭</option>
              <option value="Conejo">Conejo 🐰</option>
              <option value="Otro">Otro ❓</option>
            </select>

            <div className="Categoria">🧬 Raza *</div>
            <input
              className="Input"
              type="text"
              placeholder="ej: Golden Retriever, Persa, Canario..."
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
            />

            <div className="Categoria">⚖️ Peso (kg) *</div>
            <input
              className="Input"
              type="text"
              placeholder="ej: 5.5"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />

            <div className="Categoria">📷 Foto</div>
            <input
              className="Input Foto"
              type="text"
              placeholder="https://ejemplo.com/foto-mascota.jpg"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
            />

            <div className="Aviso">
              <p>Puedes agregar una foto más tarde si no tienes una ahora...</p>
            </div>
          </div>

          {mensaje && <div className="Mensaje">{mensaje}</div>}

          <div className="BotonContainer">
            <button className="Boton" type="submit">Registrar Mascota</button>
          </div>
        </form>

        <div className="Nota">
          <p className="Texto">
            <strong>Nota: </strong>Todos los campos marcados con <strong className='Apostrofe'>*</strong> son obligatorios. La foto es opcional y puedes agregarla más tarde.
          </p>
        </div>
      </div>
    </div>
  );
};
export default PetRegistrationForm;
