import React from "react";
import { Home, User, Plus } from "lucide-react";
import { getImageUrl } from "../api";

const DeliveredItemsPage = ({ deliveredItems, onNavigate, loading }) => {
  return (
    <div className="items-page">
      {/* HEADER */}
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>
        <div className="delivered-title">ITEM WE DELIVERED</div>
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

      {/* CONTENT */}
      <div className="items-content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : deliveredItems.length > 0 ? (
          <div className="items-grid">
            {deliveredItems.map((item) => (
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
                  {item.deliveredAt && (
                    <>
                      <p className="label">DELIVERED ON:</p>
                      <p className="value">
                        {new Date(item.deliveredAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No delivered items yet.</p>
          </div>
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
