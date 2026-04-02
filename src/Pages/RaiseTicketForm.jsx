import React, { useState } from "react";
import { Home, User, ArrowLeft, Upload } from "lucide-react";

const RaiseTicketForm = ({ onNavigate, onTicketRaised }) => {
  const [form, setForm] = useState({
    name: "",
    placeLost: "",
    idNo: "",
    mobile: "",
    daysAgo: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.placeLost || !form.idNo || !form.mobile) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("placeLost", form.placeLost);
      formData.append("idNo", form.idNo);
      formData.append("mobile", form.mobile);
      formData.append("daysAgo", form.daysAgo || "Today");
      if (image) formData.append("image", image);

      await onTicketRaised(formData);
      setSuccess("Ticket raised successfully!");
      setForm({ name: "", placeLost: "", idNo: "", mobile: "", daysAgo: "" });
      setImage(null);
      setPreview(null);
      setTimeout(() => {
        setSuccess("");
        onNavigate("raise-ticket");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to raise ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-page">
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>
        <h2 className="items-title">RAISE LOST TICKET</h2>
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
        <button className="back-btn" onClick={() => onNavigate("raise-ticket")}>
          <ArrowLeft size={18} /> Back to Tickets
        </button>

        <div className="form-card">
          <h2 className="form-title">Report a Lost Item</h2>
          <p className="form-subtitle">
            Raise a ticket so we can help you find your item
          </p>

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
                placeholder="e.g., Laptop, Textbook, Phone"
              />
            </div>

            <div className="form-group">
              <label>Place Lost *</label>
              <input
                type="text"
                name="placeLost"
                value={form.placeLost}
                onChange={handleChange}
                placeholder="e.g., Computer Lab, Classroom 305"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Student ID *</label>
                <input
                  type="text"
                  name="idNo"
                  value={form.idNo}
                  onChange={handleChange}
                  placeholder="e.g., 2100031234"
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="e.g., 9876543210"
                />
              </div>
            </div>

            <div className="form-group">
              <label>When did you lose it?</label>
              <input
                type="text"
                name="daysAgo"
                value={form.daysAgo}
                onChange={handleChange}
                placeholder="e.g., Today, 2 days ago, Last week"
              />
            </div>

            <div className="form-group">
              <label>Upload Image (optional)</label>
              <div
                className="image-upload-area"
                onClick={() => document.getElementById("lost-image").click()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={40} />
                    <p>Click to upload image</p>
                  </div>
                )}
              </div>
              <input
                id="lost-image"
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "RAISE TICKET"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseTicketForm;
