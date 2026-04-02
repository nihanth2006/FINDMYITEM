import React, { useState, useEffect } from "react";
import { Home, User, LogOut, Package, AlertTriangle, Truck, CheckCircle } from "lucide-react";
import Header from "./Header";
import { statsAPI } from "../api";

const AdminDashboard = ({ onNavigate, adminInfo, onLogout }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    statsAPI.get()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="admin-page">
      {/* Curved Header wrapper */}
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
              <strong>Admin ID:</strong> {adminInfo?.username || "KL-ADMIN-001"}
            </p>
            <p>
              <strong>Email:</strong> {adminInfo?.email || "admin@klu.edu.in"}
            </p>
            <p>
              <strong>Name:</strong> {adminInfo?.name || "KL Admin"}
            </p>
            <p>
              <strong>Session:</strong> Active
            </p>
          </div>

          {/* STATS CARDS */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card stat-found">
                <Package size={28} />
                <div>
                  <h3>{stats.foundItems}</h3>
                  <p>Found Items</p>
                </div>
              </div>
              <div className="stat-card stat-lost">
                <AlertTriangle size={28} />
                <div>
                  <h3>{stats.lostItems}</h3>
                  <p>Lost Tickets</p>
                </div>
              </div>
              <div className="stat-card stat-handover">
                <Truck size={28} />
                <div>
                  <h3>{stats.handoverItems}</h3>
                  <p>Pending Handover</p>
                </div>
              </div>
              <div className="stat-card stat-delivered">
                <CheckCircle size={28} />
                <div>
                  <h3>{stats.deliveredItems}</h3>
                  <p>Delivered</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT BLOCK */}
        <div className="admin-block">
          <h2 className="section-title">Quick Actions</h2>

          <div className="admin-actions">
            <button className="admin-btn" onClick={() => onNavigate("items")}>
              View Found Items
            </button>
            <button className="admin-btn" onClick={() => onNavigate("raise-ticket")}>
              View Lost Tickets
            </button>
            <button className="admin-btn" onClick={() => onNavigate("remove-item")}>
              Handover Items
            </button>
            <button className="admin-btn" onClick={() => onNavigate("delivered")}>
              Delivery History
            </button>
            <button className="admin-btn" onClick={() => onNavigate("add-found-item")}>
              Add Found Item
            </button>
            <button className="admin-btn" onClick={() => onNavigate("raise-ticket-form")}>
              Raise Lost Ticket
            </button>
          </div>

          {onLogout && (
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={18} /> LOGOUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
