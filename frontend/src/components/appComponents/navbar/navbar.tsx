import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import USAFlag from "../../../assets/usaFlag.svg";
import GermanFlag from "../../../assets/germanFlag.svg";
import ProfileIcon from "../../../assets/profileIcon.svg";
import Logo from "../../../assets/siemens.png";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { t, i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState("de");

  const handleLanguageChange = (language: string) => {
    if (language !== currentLanguage) {
      i18n.changeLanguage(language);

      setCurrentLanguage(language);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav aria-label="Main Navigation" className="navbar" role="navigation">
      <div className="navbar-colors" aria-hidden="true">
        <span className="navbar-color"></span>
        <span className="navbar-color"></span>
        <span className="navbar-color"></span>
      </div>

      <div className="navbar-main">
        <div className="navbar-section navbar-section-left">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/regions");
            }}
            className="navbar-bonus-plus"
            aria-label="Go to homepage"
          >
            <strong>A Demo Project</strong>
          </a>
          <a
            href="/regions"
            onClick={(e) => {
              e.preventDefault();
              navigate("/regions");
            }}
            className={`navbar-link ${isActive("/regions") ? "active" : ""}`}
            {...(isActive("/regions") ? { "aria-current": "page" } : {})}
          >
            {t("regions")}
          </a>
        </div>

        <div className="navbar-section navbar-section-right">
          <div
            className="navbar-language-selector"
            aria-label="Select Language"
          >
            <button
              className="navbar-flag-button"
              onClick={() => handleLanguageChange("en")}
              aria-label="Select English"
            >
              <img className="navbar-flag" src={USAFlag} alt="USA Flag" />
            </button>

            <button
              className="navbar-flag-button"
              onClick={() => handleLanguageChange("de")}
              aria-label="Select German"
            >
              <img className="navbar-flag" src={GermanFlag} alt="German Flag" />
            </button>
          </div>

          <button className="navbar-user-icon" aria-label="User Account">
            <img
              className="navbar-profile-icon"
              src={ProfileIcon}
              alt="Profile Icon"
            />
          </button>

          <img
            className="navbar-logo"
            src={Logo}
            alt="Siemens Logo"
            onClick={() => navigate("/regions")}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

