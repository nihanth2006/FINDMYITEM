import React from "react";
import Header from "./Header";

const AdminDashboard = ({ onNavigate }) => {
  return (
    <div className="admin-page">
      {/* ✅ Curved Header wrapper */}
      <div className="top-header">
        <Header onNavigate={onNavigate} />
      </div>

      <div className="admin-container">
        {/* LEFT BLOCK */}
        <div className="admin-block">
          <h1 className="admin-title">ADMIN DASHBOARD</h1>

          <div className="admin-card">
            <h2 className="section-title">Admin Login Details</h2>

            <p>
              <strong>Admin ID:</strong> KL-ADMIN-001
            </p>
            <p>
              <strong>Email:</strong> admin@klu.edu.in
            </p>
            <p>
              <strong>Last Login:</strong> Today, 10:42 AM
            </p>
          </div>
        </div>

        {/* RIGHT BLOCK */}
        <div className="admin-block">
          <h2 className="section-title">Quick Actions</h2>

          <div className="admin-actions">
            <button className="admin-btn" onClick={() => onNavigate("items")}>
              View Found Items
            </button>

            <button
              className="admin-btn"
              onClick={() => onNavigate("raise-ticket")}
            >
              View Lost Tickets
            </button>

            <button
              className="admin-btn"
              onClick={() => onNavigate("remove-item")}
            >
              Handover Items
            </button>

            <button
              className="admin-btn"
              onClick={() => onNavigate("delivered")}
            >
              Delivery History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
