import React from "react";
import { Home, User, Plus } from "lucide-react";
import { getImageUrl } from "../api";

const RemoveItemPage = ({ itemsToHandover, onDeliverItem, onNavigate, loading }) => {
  return (
    <div className="items-page">
      {/* HEADER */}
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>
        <h2 className="items-title">REMOVE ITEM PAGE:</h2>
        <div className="top-actions">
          <div className="circle-btn" onClick={() => onNavigate("home")}>
            <Home size={26} />
          </div>
          <div className="circle-btn" onClick={() => onNavigate("admin")}>
            <User size={26} />
          </div>
          <button className="about-btn" onClick={() => onNavigate("about")}>
            ABOUT ME
          </button>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <div className="items-content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : itemsToHandover.length > 0 ? (
          <div className="items-grid">
            {itemsToHandover.map((item) => (
              <div key={item.id} className="item-card">
                {/* IMAGE BOX */}
                <div className="item-image-box">
                  {item.image ? (
                    <img src={getImageUrl(item.image)} alt={item.name} className="item-image" />
                  ) : (
                    <Plus className="plus-icon" size={50} />
                  )}
                </div>

                {/* DETAILS */}
                <div className="item-details">
                  <p className="label">ITEM NAME:</p>
                  <p className="value">{item.name}</p>
                  <p className="label">PERSON NAME:</p>
                  <p className="value">{item.personName}</p>
                  {item.mobile && (
                    <>
                      <p className="label">MOBILE NO:</p>
                      <p className="value">{item.mobile}</p>
                    </>
                  )}
                </div>

                {/* DELIVER BUTTON */}
                <button
                  className="deliver-btn"
                  onClick={() => onDeliverItem(item.id)}
                >
                  DELIVER ITEM
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No items to hand over.</p>
          </div>
        )}

        {/* ADD HANDOVER BUTTON */}
        <div className="side-actions">
          <button className="big-add-item-btn" onClick={() => onNavigate("add-handover")}>
            ADD HANDOVER
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveItemPage;
