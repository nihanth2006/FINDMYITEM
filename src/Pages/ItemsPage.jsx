import React from "react";
import { Home, User, Plus, X } from "lucide-react";

const ItemsPage = ({ onNavigate, foundItems, onRemoveFromFound }) => {
  return (
    <div className="items-page">
      {/* HEADER */}
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>

        <h2 className="items-title">ITEMS PAGE:</h2>

        <div className="top-actions">
          {/* HOME ICON */}
          <div className="circle-btn" onClick={() => onNavigate("home")}>
            <Home size={26} />
          </div>

          {/* FIXED: USER ICON → ADMIN PAGE */}
          <div className="circle-btn" onClick={() => onNavigate("admin")}>
            <User size={26} />
          </div>

          {/* ABOUT BUTTON */}
          <button className="about-btn" onClick={() => onNavigate("about")}>
            ABOUT ME
          </button>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="items-content">
        {/* GRID OF FOUND ITEMS */}
        <div className="items-grid">
          {(foundItems || []).map((item) => (
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
                  onClick={() => onRemoveFromFound(item.id)}
                >
                  REMOVE <X size={18} />
                </button>
              </div>

              {/* DETAILS */}
              <div className="item-details">
                <p className="label">ITEM NAME:</p>
                <p className="value">{item.name}</p>

                <p className="label">PLACE FOUND:</p>
                <p className="value">{item.placeFound}</p>

                <p className="label">YOU CAN FIND IN:</p>
                <p className="value">{item.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ADD ITEM BUTTON */}
        <button
          className="big-add-item-btn"
          onClick={() => onNavigate("raise-ticket")}
        >
          ADD ITEM
        </button>
      </div>
    </div>
  );
};

export default ItemsPage;
