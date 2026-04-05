import React, { useState, useEffect } from "react";
import { LogOut, Package, AlertTriangle, Truck, CheckCircle } from "lucide-react";
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
      <Header onNavigate={onNavigate} />

      <div className="admin-container">
        <div className="admin-block">
          <div className="admin-card">
            <div className="admin-overview">
              <div>
                <div className="admin-eyebrow">Control center</div>
                <h1 className="admin-title">Admin Dashboard</h1>
                <p className="admin-summary">
                  Monitor active records, review handovers, and move quickly between
                  daily campus operations from a single dashboard.
                </p>
              </div>
              <div className="session-pill">Session Active</div>
            </div>
          </div>

          <div className="admin-card">
            <h2 className="section-title">Admin Profile</h2>
            <p>
              <strong>Admin ID:</strong> {adminInfo?.username || "KL-ADMIN-001"}
            </p>
            <p>
              <strong>Email:</strong> {adminInfo?.email || "admin@klu.edu.in"}
            </p>
            <p>
              <strong>Name:</strong> {adminInfo?.name || "KL Admin"}
            </p>
          </div>

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

        <div className="admin-block">
          <div className="action-panel">
            <h2 className="section-title">Quick Actions</h2>
            <p className="admin-summary">
              Jump directly into the workflows your team uses most often.
            </p>

            <div className="admin-actions">
              <button className="admin-btn" onClick={() => onNavigate("items")}>
                View Found Items
              </button>
              <button className="admin-btn" onClick={() => onNavigate("raise-ticket")}>
                View Lost Tickets
              </button>
              <button className="admin-btn" onClick={() => onNavigate("remove-item")}>
                Manage Handover
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
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
