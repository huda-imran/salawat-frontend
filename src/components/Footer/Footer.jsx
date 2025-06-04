import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
                    <a href="/terms-of-service" className="footer-link">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
