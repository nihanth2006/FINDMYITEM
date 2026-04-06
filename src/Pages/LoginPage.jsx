import React, { useState } from "react";
import { Home, Lock, User as UserIcon } from "lucide-react";

const LoginPage = ({ onNavigate, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>
        <h2 className="items-title">ADMIN LOGIN</h2>
        <div className="top-actions">
          <div className="circle-btn" onClick={() => onNavigate("home")}>
            <Home size={26} />
          </div>
        </div>
      </header>

      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">
            <Lock size={50} />
          </div>
          <h2>Admin Login</h2>
          <p className="login-subtitle">Sign in to access the dashboard</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <UserIcon size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Enter admin username"
              />
            </div>

            <div className="form-group">
              <label>
                <Lock size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>

          <p className="login-hint">Use your configured admin credentials</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
