import React, { useState } from "react";
import { Home, User, Plus, X, Search } from "lucide-react";
import { getImageUrl } from "../api";

const RaiseTicketPage = ({ lostItems, onRemoveFromLost, onNavigate, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = (lostItems || []).filter((item) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(s) ||
      item.placeLost.toLowerCase().includes(s) ||
      (item.idNo && item.idNo.toLowerCase().includes(s))
    );
  });

  return (
    <div className="items-page">
      {/* HEADER */}
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>
        <h2 className="items-title">RAISE TICKET PAGE:</h2>
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

      {/* SEARCH BAR */}
      <div className="search-bar-container">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by item name, place, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X size={18} className="search-clear" onClick={() => setSearchTerm("")} />
          )}
        </div>
        <span className="search-count">{filteredItems.length} ticket(s) found</span>
      </div>

      {/* CONTENT SECTION */}
      <div className="items-content">
        {loading ? (
          <div className="loading-spinner">Loading tickets...</div>
        ) : (
          <div className="items-grid">
            {filteredItems.length === 0 ? (
              <div className="empty-state">
                <p>{searchTerm ? "No tickets match your search" : "No lost item tickets yet"}</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="item-card">
                  {/* IMAGE BOX */}
                  <div className="item-image-box">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} className="item-image" />
                    ) : (
                      <Plus className="plus-icon" size={50} />
                    )}
                  </div>

                  {/* BUTTONS */}
                  <div className="item-actions">
                    <button className="add-btn" onClick={() => onNavigate("raise-ticket-form")}>
                      <Plus size={18} /> ADD
                    </button>
                    <button className="remove-btn" onClick={() => onRemoveFromLost(item.id)}>
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
              ))
            )}
          </div>
        )}

        {/* BIG BUTTON */}
        <button className="big-add-item-btn" onClick={() => onNavigate("raise-ticket-form")}>
          RAISE TICKET
        </button>
      </div>
    </div>
  );
};

export default RaiseTicketPage;
