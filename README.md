📦 FINDMYITEM – VAULT (Lost & Found System)
🧾 About the Project

FindMyItem (VAULT) is a university-wide Lost & Found Management System developed for KL University.
It enables students and staff to report, search, and recover lost items through a secure and organized platform.

🚀 How It Works
🔍 Report Lost Items

Users submit a ticket with item details and images.

📥 Add Found Items

Users can list found items to help owners locate them.

🤝 Secure Handover

Admin verifies ownership and manages the handover process.

✨ Features
📸 Image-based lost item reporting
🔎 Search & filter found items
🔐 Admin dashboard for verification
📦 Handover & delivery tracking
📜 Complete delivery history
☁️ Image upload support
🛠️ Tech Stack
⚛️ Frontend: React.js
🌐 Backend: Node.js + Express.js
🗄️ Database: PostgreSQL (as per your latest commit)
🔗 API: REST API
🎨 Icons: Lucide

📂 Project Structure
FINDMYITEM/
│
├── public/              # Static assets
├── src/                 # React frontend source
├── server/              # Express backend + APIs
│
├── .eslintrc.json       # Lint configuration
├── .gitignore           # Ignored files
├── package.json         # Project dependencies
├── package-lock.json
│
├── render.yaml          # Render deployment config
├── vercel.json          # Vercel deployment config
├── DEPLOY_RENDER.md     # Deployment guide (Render)
│
└── README.md            # Project documentation


⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/findmyitem.git
cd findmyitem
2️⃣ Install Dependencies
npm install
cd server && npm install
3️⃣ Run the Project
# Run backend
cd server
npm start

# Run frontend
cd ..
npm start
🔐 Environment Variables
Create a .env file inside /server:
PORT=5000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
🚀 Deployment
🌐 Frontend: Vercel (vercel.json)
⚙️ Backend: Render (render.yaml)

Refer:
👉 DEPLOY_RENDER.md for backend deployment steps

💡 Future Enhancements
🤖 AI-based lost item matching
🔔 Email/SMS notifications
📱 Mobile app version
🧾 QR-based item verification
🤝 Contribution
Fork the repo
Create a branch
Make changes
Submit PR

🏫 Developed For
KL University – Koneru Lakshmaiah Education Foundation

👨‍💻 Author
Nihanth B
