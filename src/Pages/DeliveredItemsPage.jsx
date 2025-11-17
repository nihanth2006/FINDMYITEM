import React from "react";
import { Home, User, Plus } from "lucide-react";

const DeliveredItemsPage = ({ deliveredItems, onNavigate }) => {
  return (
    <div className="items-page">
      {/* 🔴 HEADER */}
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>

        {/* BIG YELLOW TITLE */}
        <div className="delivered-title">ITEM WE DELIVERED</div>

        {/* RIGHT SIDE ICONS */}
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

      {/* CONTENT */}
      <div className="items-content">
        {/* LEFT CARD SECTION */}
        {deliveredItems.length > 0 ? (
          <div className="item-card">
            {/* IMAGE BOX */}
            <div className="item-image-box">
              <Plus className="plus-icon" size={50} />
            </div>

            {/* DETAILS */}
            <div className="item-details">
              <p className="label">ITEM NAME:</p>
              <p className="value">{deliveredItems[0].name}</p>

              <p className="label">PERSON NAME:</p>
              <p className="value">{deliveredItems[0].personName}</p>

              <p className="label">Mobile No:</p>
              <p className="value">{deliveredItems[0].mobile}</p>
            </div>
          </div>
        ) : (
          <p>No delivered items yet.</p>
        )}

        {/* RIGHT SIDE MESSAGE */}
        <div className="delivered-info">
          <h2>ITEMS WHICH ARE DELIVERED</h2>
          <h3>ADD INTO THE HISTORY</h3>
        </div>
      </div>
    </div>
  );
};

export default DeliveredItemsPage;
