import React, { useState } from "react";
import { Home, User, ArrowLeft } from "lucide-react";

const AddHandoverForm = ({ onNavigate, onHandoverAdded }) => {
  const [form, setForm] = useState({ name: "", personName: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.personName) {
      setError("Please fill in item name and person name");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onHandoverAdded(form);
      setSuccess("Item added to handover queue!");
      setForm({ name: "", personName: "", mobile: "" });
      setTimeout(() => {
        setSuccess("");
        onNavigate("remove-item");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-page">
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>
        <h2 className="items-title">ADD HANDOVER ITEM</h2>
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

      <div className="form-container">
        <button className="back-btn" onClick={() => onNavigate("remove-item")}>
          <ArrowLeft size={18} /> Back to Handover
        </button>

        <div className="form-card">
          <h2 className="form-title">Schedule Item Handover</h2>
          <p className="form-subtitle">Add an item to be handed over to its owner</p>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Water Bottle, Laptop"
              />
            </div>

            <div className="form-group">
              <label>Person Claiming *</label>
              <input
                type="text"
                name="personName"
                value={form.personName}
                onChange={handleChange}
                placeholder="e.g., Rahul Kumar"
              />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="e.g., 9876543210"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "ADD TO HANDOVER"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHandoverForm;
