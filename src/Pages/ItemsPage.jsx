import React, { useState } from "react";
import { Home, User, Plus, X, Search } from "lucide-react";
import { getImageUrl } from "../api";

const ItemsPage = ({ onNavigate, foundItems, onRemoveFromFound, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = (foundItems || []).filter((item) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(s) ||
      item.placeFound.toLowerCase().includes(s) ||
      item.location.toLowerCase().includes(s)
    );
  });

  return (
    <div className="items-page">
      {/* HEADER */}
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>
        <h2 className="items-title">ITEMS PAGE:</h2>
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
            placeholder="Search items by name, place, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X size={18} className="search-clear" onClick={() => setSearchTerm("")} />
          )}
        </div>
        <span className="search-count">{filteredItems.length} item(s) found</span>
      </div>

      {/* PAGE CONTENT */}
      <div className="items-content">
        {loading ? (
          <div className="loading-spinner">Loading items...</div>
        ) : (
          <div className="items-grid">
            {filteredItems.length === 0 ? (
              <div className="empty-state">
                <p>{searchTerm ? "No items match your search" : "No found items yet"}</p>
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
                    <button className="add-btn" onClick={() => onNavigate("add-found-item")}>
                      <Plus size={18} /> ADD
                    </button>
                    <button className="remove-btn" onClick={() => onRemoveFromFound(item.id)}>
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
              ))
            )}
          </div>
        )}

        {/* ADD ITEM BUTTON */}
        <button className="big-add-item-btn" onClick={() => onNavigate("add-found-item")}>
          ADD ITEM
        </button>
      </div>
    </div>
  );
};

export default ItemsPage;
