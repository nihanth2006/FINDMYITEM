import React from "react";
import { Home, User, ArrowLeft } from "lucide-react";

const AboutPage = ({ onNavigate }) => {
  return (
    <div className="items-page">
      <header className="items-header">
        <div className="uni-box">KL UNIVERSITY</div>
        <h2 className="items-title">ABOUT</h2>
        <div className="top-actions">
          <div className="circle-btn" onClick={() => onNavigate("home")}>
            <Home size={26} />
          </div>
          <div className="circle-btn" onClick={() => onNavigate("admin")}>
            <User size={26} />
          </div>
          <button className="about-btn active" onClick={() => onNavigate("about")}>
            ABOUT ME
          </button>
        </div>
      </header>

      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">FindMyItem</h1>
          <p className="about-tagline">VAULT - Items Lost & Found</p>
        </div>

        <div className="about-content">
          <div className="about-card">
            <h2>About the Project</h2>
            <p>
              FindMyItem is a university-wide Lost & Found management system built
              for KL University. It provides a secure and efficient platform for
              students and staff to report lost items, browse found items, and
              manage the handover process.
            </p>
          </div>

          <div className="about-card">
            <h2>How It Works</h2>
            <div className="about-steps">
              <div className="about-step">
                <div className="step-number">1</div>
                <div>
                  <h3>Report Lost Items</h3>
                  <p>Raise a ticket with details about your lost item so others can help you find it.</p>
                </div>
              </div>
              <div className="about-step">
                <div className="step-number">2</div>
                <div>
                  <h3>Add Found Items</h3>
                  <p>Found something? List it here so the owner can locate and claim it.</p>
                </div>
              </div>
              <div className="about-step">
                <div className="step-number">3</div>
                <div>
                  <h3>Handover & Delivery</h3>
                  <p>Once a match is found, items are handed over securely through admin verification.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-card">
            <h2>Features</h2>
            <ul className="about-features">
              <li>Report and track lost items with images</li>
              <li>Browse found items with search & filter</li>
              <li>Secure admin dashboard for management</li>
              <li>Item handover and delivery tracking</li>
              <li>Complete delivery history</li>
              <li>Image upload support</li>
            </ul>
          </div>

          <div className="about-card">
            <h2>Technology Stack</h2>
            <div className="tech-stack">
              <span className="tech-badge">React.js</span>
              <span className="tech-badge">Express.js</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">REST API</span>
              <span className="tech-badge">Lucide Icons</span>
            </div>
          </div>

          <div className="about-card">
            <h2>Developed For</h2>
            <p><strong>KL University</strong> - Koneru Lakshmaiah Education Foundation</p>
            <p>A project to help the campus community recover lost belongings efficiently.</p>
          </div>
        </div>

        <button className="back-home-btn" onClick={() => onNavigate("home")}>
          <ArrowLeft size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
