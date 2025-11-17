import React from "react";
import { Home, User, Plus, X } from "lucide-react";

const RaiseTicketPage = ({ lostItems, onRemoveFromLost, onNavigate }) => {
  return (
    <div className="items-page">
      {/* 🔴 HEADER SAME AS ITEMS PAGE */}
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>

        <h2 className="items-title">RAISE TICKET PAGE:</h2>

        <div className="top-actions">
          {/* HOME ICON */}
          <div className="circle-btn" onClick={() => onNavigate("home")}>
            <Home size={26} />
          </div>

          {/* ✅ FIXED — USER ICON → ADMIN PAGE */}
          <div className="circle-btn" onClick={() => onNavigate("admin")}>
            <User size={26} />
          </div>

          {/* ABOUT BUTTON */}
          <button className="about-btn" onClick={() => onNavigate("about")}>
            ABOUT ME
          </button>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <div className="items-content">
        {/* LOST ITEMS GRID */}
        <div className="items-grid">
          {(lostItems || []).map((item) => (
            <div key={item.id} className="item-card">
              {/* IMAGE BOX */}
              <div className="item-image-box">
                <Plus className="plus-icon" size={50} />
              </div>

              {/* BUTTONS */}
              <div className="item-actions">
                <button className="add-btn">
                  <Plus size={18} /> ADD
                </button>

                <button
                  className="remove-btn"
                  onClick={() => onRemoveFromLost(item.id)}
                >
                  REMOVE <X size={18} />
                </button>
              </div>

              {/* DETAILS */}
              <div className="item-details">
                <p className="label">ITEM NAME:</p>
                <p className="value">{item.name}</p>

                <p className="label">PLACE I LOST:</p>
                <p className="value">{item.placeLost}</p>

                <p className="label">ID NO:</p>
                <p className="value">{item.idNo}</p>

                <p className="label">MOBILE NO:</p>
                <p className="value">{item.mobile}</p>

                <p className="label">DAYS AGO:</p>
                <p className="value">{item.daysAgo}</p>
              </div>
            </div>
          ))}
        </div>

        {/* BIG ORANGE BUTTON RIGHT SIDE */}
        <button
          className="big-add-item-btn"
          onClick={() => onNavigate("raise-ticket")}
        >
          ITEM LOST PAGE
        </button>
      </div>
    </div>
  );
};

export default RaiseTicketPage;
