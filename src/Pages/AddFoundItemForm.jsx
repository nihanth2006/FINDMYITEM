import React, { useState } from "react";
import { Home, User, ArrowLeft, Upload } from "lucide-react";

const AddFoundItemForm = ({ onNavigate, onItemAdded }) => {
  const [form, setForm] = useState({ name: "", placeFound: "", location: "" });
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
    if (!form.name || !form.placeFound || !form.location) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("placeFound", form.placeFound);
      formData.append("location", form.location);
      if (image) formData.append("image", image);

      await onItemAdded(formData);
      setSuccess("Item added successfully!");
      setForm({ name: "", placeFound: "", location: "" });
      setImage(null);
      setPreview(null);
      setTimeout(() => {
        setSuccess("");
        onNavigate("items");
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
        <h2 className="items-title">ADD FOUND ITEM</h2>
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
        <button className="back-btn" onClick={() => onNavigate("items")}>
          <ArrowLeft size={18} /> Back to Items
        </button>

        <div className="form-card">
          <h2 className="form-title">Report a Found Item</h2>
          <p className="form-subtitle">Help someone find their lost belonging</p>

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
                placeholder="e.g., Blue Backpack, ID Card"
              />
            </div>

            <div className="form-group">
              <label>Place Found *</label>
              <input
                type="text"
                name="placeFound"
                value={form.placeFound}
                onChange={handleChange}
                placeholder="e.g., Library, Cafeteria, Block A"
              />
            </div>

            <div className="form-group">
              <label>Where to Collect *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Security Office - Block A"
              />
            </div>

            <div className="form-group">
              <label>Upload Image (optional)</label>
              <div className="image-upload-area" onClick={() => document.getElementById("found-image").click()}>
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
                id="found-image"
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "ADD FOUND ITEM"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFoundItemForm;
