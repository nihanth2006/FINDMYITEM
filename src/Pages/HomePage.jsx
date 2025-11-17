import React from "react";
import { Home, User } from "lucide-react";

const HomePage = ({ onNavigate }) => {
  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="top-header">
        <h2 className="logo-text">KL UNIVERSITY</h2>

        <div className="header-right">
          {/* HOME ICON */}
          <Home className="header-icon" onClick={() => onNavigate("home")} />

          {/* ABOUT BUTTON */}
          <button className="about-btn" onClick={() => onNavigate("about")}>
            ABOUT ME
          </button>

          {/* USER ICON → ALWAYS GO TO ADMIN DASHBOARD */}
          <User className="header-icon" onClick={() => onNavigate("admin")} />
        </div>
      </header>

      {/* MAIN SPLIT SECTION */}
      <div className="split-container">
        {/* LEFT SECTION */}
        <div className="left-section">
          <h1 className="big-logo">FindMyItem</h1>
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">
          <h1 className="welcome-heading">VAULT – ITEMS LOST & FOUND</h1>

          <p className="welcome-text">
            A secure place to report lost belongings and find recovered items
            within the university.
          </p>

          <div className="button-row">
            {/* ITEM LOST */}
            <button onClick={() => onNavigate("items")} className="main-btn">
              ITEM LOST
            </button>

            {/* ADD ITEM */}
            <button
              onClick={() => onNavigate("raise-ticket")}
              className="main-btn"
            >
              ADD ITEM
            </button>

            {/* REMOVE ITEM */}
            <button
              onClick={() => onNavigate("remove-item")}
              className="main-btn"
              style={{ backgroundColor: "#c62828" }}
            >
              REMOVE ITEM
            </button>

            {/* ✅ FIXED HISTORY BUTTON → NOW RED */}
            <button
              onClick={() => onNavigate("delivered")}
              className="main-btn"
            >
              HISTORY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
