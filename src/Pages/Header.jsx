import React from "react";
import { FaHome, FaUser } from "react-icons/fa";

const Header = ({ onNavigate }) => {
  return (
    <header className="dashboard-header">
      <div className="brand-lockup">
        <div className="header-badge">KL University</div>
        <h2 className="header-title">Operations Dashboard</h2>
      </div>

      <div className="header-nav">
        <div className="header-icon" onClick={() => onNavigate("home")}>
          <FaHome />
        </div>

        <button className="about-btn" onClick={() => onNavigate("about")}>
          About
        </button>

        <div className="header-icon" onClick={() => onNavigate("admin")}>
          <FaUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
