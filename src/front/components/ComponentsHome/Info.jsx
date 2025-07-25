import React from 'react';
import { FaCalendarAlt, FaHeart, FaCommentDots, FaBookOpen, FaMobileAlt } from "react-icons/fa";
import '../../styles/home.css';

const infoItems = [
    { icon: <FaCalendarAlt />, title: 'Realiza todos los cuidados a tiempo' },
    { icon: <FaHeart />, title: 'Monitorea su salud con atención' },
    { icon: <FaCommentDots />, title: 'Obtén respuestas a todas sus preguntas' },
    { icon: <FaBookOpen />, title: 'Conoce todo lo que necesitas sobre tu mascota' },
    { icon: <FaMobileAlt />, title: 'Guarda todos sus datos en tu móvil' },
];

const Info = () => (
    <section className="info-section bg-purple-dark">
        <div className="container">
            <h2 className="info-title text-white">
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
