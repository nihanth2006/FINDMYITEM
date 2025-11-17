import React from "react";
import { Home, User, Plus } from "lucide-react";

const RemoveItemPage = ({ itemsToHandover, onDeliverItem, onNavigate }) => {
  return (
    <div className="items-page">
      {/* 🔴 HEADER */}
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>

        <h2 className="items-title">REMOVE ITEM PAGE:</h2>

        <div className="top-actions">
          {/* HOME */}
          <div className="circle-btn" onClick={() => onNavigate("home")}>
            <Home size={26} />
          </div>

          {/* ✅ FIXED — USER ICON → ADMIN DASHBOARD */}
          <div className="circle-btn" onClick={() => onNavigate("admin")}>
            <User size={26} />
          </div>

          {/* ABOUT */}
          <button className="about-btn" onClick={() => onNavigate("about")}>
            ABOUT ME
          </button>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <div className="items-content">
        {/* ONLY ONE ITEM AT A TIME */}
        {itemsToHandover.length > 0 ? (
          <div className="item-card">
            {/* IMAGE BOX */}
            <div className="item-image-box">
              <Plus className="plus-icon" size={50} />
            </div>

            {/* DETAILS */}
            <div className="item-details">
              <p className="label">ITEM NAME:</p>
              <p className="value">{itemsToHandover[0].name}</p>

              <p className="label">PERSON NAME:</p>
              <p className="value">{itemsToHandover[0].personName}</p>
            </div>
          </div>
        ) : (
          <p>No items to hand over.</p>
        )}

        {/* REMOVE BUTTON */}
        {itemsToHandover.length > 0 && (
          <button
            className="big-add-item-btn"
            onClick={() => onDeliverItem(itemsToHandover[0].id)}
          >
            REMOVE ITEM
          </button>
        )}
      </div>
    </div>
  );
};

export default RemoveItemPage;
