import React from 'react';
import '../../styles/home.css';

const infoItems = [
    { icon: '📅', title: 'Realiza todos los cuidados a tiempo' },
    { icon: '❤️', title: 'Monitorea su salud con atención' },
    { icon: '💬', title: 'Obtén respuestas a todas sus preguntas' },
    { icon: '📖', title: 'Conoce todo lo que necesitas sobre tu mascota' },
    { icon: '📱', title: 'Guarda todos sus datos en tu móvil' },
];

const Info = () => (
    <section className="info-section">
        <div className="container">
            <h2 className="info-title">
                Por qué elegir <span className="underline">PetCare</span> para tu mascota
            </h2>
            <div className="info-cards">
                {infoItems.map((item, i) => (
                    <div key={i} className="info-card">
                        <div className="info-icon">{item.icon}</div>
                        <h3 className="info-text">{item.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Info;