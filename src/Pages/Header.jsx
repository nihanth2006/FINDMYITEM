import React from "react";
import { FaHome, FaUser } from "react-icons/fa";

const Header = ({ onNavigate }) => {
  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>KL UNIVERSITY</h2>

      <div style={styles.rightMenu}>
        <FaHome style={styles.icon} onClick={() => onNavigate("home")} />

        <button style={styles.aboutBtn} onClick={() => onNavigate("about")}>
          ABOUT ME
        </button>

        <FaUser style={styles.icon} onClick={() => onNavigate("admin")} />
      </div>
    </header>
  );
};

const styles = {
  /* ONLY ONE CURVED HEADER */
  header: {
    backgroundColor: "#e23314",
    padding: "18px 35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    borderRadius: "40px",
    width: "90%",
    margin: "20px auto",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },

  logo: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "bold",
  },

  rightMenu: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  icon: {
    fontSize: "26px",
    cursor: "pointer",
    color: "white",
  },

  aboutBtn: {
    background: "#ffd32a",
    color: "black",
    border: "none",
    padding: "10px 18px",
    borderRadius: "25px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Header;
