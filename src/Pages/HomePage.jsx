import React from "react";
import { ArrowRight, Home, ShieldCheck, Sparkles, User } from "lucide-react";

const HomePage = ({ onNavigate }) => {
  return (
    <div className="home-container">
      <header className="top-header">
        <div className="brand-lockup">
          <div className="uni-box">KL University</div>
          <h2 className="logo-text">FindMyItem</h2>
        </div>

        <div className="header-right">
          <Home className="header-icon" onClick={() => onNavigate("home")} />
          <button className="about-btn" onClick={() => onNavigate("about")}>
            About
          </button>
          <User className="header-icon" onClick={() => onNavigate("admin")} />
        </div>
      </header>

      <div className="split-container">
        <div className="left-section">
          <div className="hero-copy">
            <div className="hero-kicker">
              <ShieldCheck size={14} />
              Campus lost and found system
            </div>
            <h1 className="big-logo">Find what matters faster.</h1>
            <h2 className="welcome-heading">Professional item recovery for a busy campus.</h2>
            <p className="welcome-text">
              Track found belongings, raise lost-item requests, and manage secure
              handovers through one clean workflow designed for students,
              staff, and admin teams.
            </p>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-label">Faster intake</div>
              <div className="hero-stat-value">One place</div>
              <div className="hero-note">All found, lost, handover, and delivery records.</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Better trust</div>
              <div className="hero-stat-value">Secure flow</div>
              <div className="hero-note">Clear ownership and delivery history for every item.</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Campus ready</div>
              <div className="hero-stat-value">Mobile fit</div>
              <div className="hero-note">Works cleanly on desktop counters and phones alike.</div>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div>
            <div className="panel-label">Quick actions</div>
            <h1 className="panel-title">Choose the next step.</h1>
            <p className="panel-text">
              Each action takes you directly into the operational part of the platform,
              whether you are reporting an issue, listing a recovered item, or updating handovers.
            </p>

            <div className="button-row">
              <button onClick={() => onNavigate("items")} className="main-btn">
                View Found Items <ArrowRight size={16} style={{ marginLeft: 8 }} />
              </button>

              <button onClick={() => onNavigate("raise-ticket")} className="main-btn">
                Raise Lost Ticket <ArrowRight size={16} style={{ marginLeft: 8 }} />
              </button>

              <button onClick={() => onNavigate("remove-item")} className="main-btn">
                Manage Handover <ArrowRight size={16} style={{ marginLeft: 8 }} />
              </button>

              <button onClick={() => onNavigate("delivered")} className="main-btn history-btn">
                Delivery History <ArrowRight size={16} style={{ marginLeft: 8 }} />
              </button>
            </div>
          </div>

          <div className="home-footer-note">
            <span>Built for smoother campus operations.</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} />
              Clearer interface, quicker actions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
