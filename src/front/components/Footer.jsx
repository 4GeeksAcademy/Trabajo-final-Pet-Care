import React from "react";
import "../styles/footer.css"; 
import logo from "/img/petlogo.png"; 

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-top container">
      <div className="footer-logo">
        <a href="/">
          <img
              src={logo}
              alt="PetCare Logo"
              style={{
              height: "100px",
              objectFit: "contain",
              }}
          />
        </a>
      </div>

      <div className="footer-social">
        <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
      </div>

      <div className="footer-links">
        <div>
          <h4>La app</h4>
          <ul>
            <li><a href="#how-it-works">¿Qué ofrecemos?</a></li>
            <li><a href="#why-us">Por qué PetCare</a></li>
          </ul>
        </div>
        <div>
          <h4>FAQs</h4>
          <ul>
            <li><a href="#faqs">Preguntas frecuentes</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <small>
        © {new Date().getFullYear()} PetCare. Todos los derechos reservados.{" "}
        <a href="/privacidad">Privacidad</a> |{" "}
        <a href="/terminos">Términos</a> |{" "}
        <a href="/cookies">Cookies</a>
      </small>
    </div>
  </footer>
);

export default Footer;
