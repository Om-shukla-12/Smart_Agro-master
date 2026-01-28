import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo">
          <h1>Smart_Agro</h1>
          <p className="footer-tagline">Innovating Farming for a Sustainable Future</p>
        </div>

        {/* Contact Information */}
        <div className="footer-contact">
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:smartagro.support@gmail.com">smartagro.support@gmail.com</a>
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            <a href="tel:+919693194411">+91-9693194411</a>
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            © 2026 Smart Agro. All rights reserved. 🌾
            <span className="footer-note"> Happy Farming with Smart Agro!</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
