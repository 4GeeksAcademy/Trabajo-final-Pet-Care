import React from 'react';
import './PetRegistrationForm.css';

const PetRegistrationForm = () => {
  return (
    <div className="App">
      <img
        src="https://media.tenor.com/FFL1QxcDF64AAAAi/dog-cute.gif"
        alt="Perrito corriendo"
        className="DogRunner"
      />

      <div className="FormCard">
        <div className="Titulo">¡Registra tu Mascota!</div>
        <div className="Sub-titulo">Añade a tu compañero/a a nuestra familia</div>
        <div className="Inputs">
          <div className="Categoria">🏷️ Nombre de la mascota *</div>
          <input
            className="Input"
            id="nombre"
            type="text"
            placeholder="ej: Firulais, Michi, Rex..."
          />
          <div className="Categoria">🐾 Especie *</div>
          <select className="Select" id="especie" name="especie" required defaultValue="">
            <option value="" disabled hidden>Selecciona una especie</option>
            <option className="Perro" value="Perro">Perro 🐶</option>
            <option className="Gato" value="Gato">Gato 🐱</option>
            <option className="Ave" value="Ave">Ave 🐦</option>
            <option className="Pez" value="Pez">Pez 🐠</option>
            <option className="Reptil" value="Reptil">Reptil 🦎</option>
            <option className="Roedor" value="Roedor">Roedor 🐭</option>
            <option className="Conejo" value="Conejo">Conejo 🐰</option>
            <option className="Otro" value="Otro">Otro ❓</option>
          </select>
          <div className="Categoria">🧬 Raza *</div>
          <input
            className="Input"
            id="raza"
            type="text"
            placeholder="ej: Golden Retriever, Persa, Canario..."
          />
          <div className="Categoria">⚖️ Peso (kg) *</div>
          <input
            className="Input"
            id="peso"
            type="text"
            placeholder="ej: 5.5"
          />
          <div className="Categoria">📷 Foto</div>
          <input
            className="Input Foto"
            id="foto"
            type="text"
            placeholder="https://ejemplo.com/foto-mascota.jpg"
          />
          <div className="Aviso"><p>Puedes agregar una foto más tarde si no tienes una ahora...</p></div>
        </div>
        <div>
          <button className="Boton">Registrar Mascota</button>
        </div>
        <div className="Nota">
          <p className="Texto"><strong>Nota: </strong>Todos los campos marcados con <strong className='Apostrofe'>*</strong> son obligatorios. La foto es opcional y puedes agregarla más tarde.</p>
        </div>
      </div>
    </div>
  );
};

export default PetRegistrationForm;









