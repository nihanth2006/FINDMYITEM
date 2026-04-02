const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'findmyitem-klu-secret-2024';

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== JSON FILE DATABASE ====================
const DB_PATH = path.join(__dirname, 'data', 'db.json');

function readDB() {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Ensure directories exist
['data', 'uploads'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Initialize DB with seed data if not exists
if (!fs.existsSync(DB_PATH)) {
  const initialData = {
    admin: {
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10),
      email: 'admin@klu.edu.in',
      name: 'KL Admin'
    },
    foundItems: [
      { id: 1, name: 'Blue Backpack', placeFound: 'Library', location: 'Security Office - Block A', image: null, createdAt: new Date().toISOString() },
      { id: 2, name: 'Student ID Card', placeFound: 'Cafeteria', location: 'Admin Office', image: null, createdAt: new Date().toISOString() }
    ],
    lostItems: [
      { id: 1, name: 'Laptop', placeLost: 'Computer Lab', idNo: '2100031234', mobile: '9876543210', daysAgo: '2 days', image: null, createdAt: new Date().toISOString() },
      { id: 2, name: 'Textbook', placeLost: 'Classroom 305', idNo: '2100035678', mobile: '9876543211', daysAgo: '1 day', image: null, createdAt: new Date().toISOString() }
    ],
    handoverItems: [
      { id: 1, name: 'Water Bottle', personName: 'Rahul Kumar', mobile: '9876543213', createdAt: new Date().toISOString() }
    ],
    deliveredItems: [
      { id: 1, name: 'Mobile Phone', personName: 'Priya Sharma', mobile: '9876543212', deliveredAt: new Date().toISOString() }
    ],
    nextId: 100
  };
  writeDB(initialData);
}

// Auto-increment ID helper
function getNextId() {
  const db = readDB();
  const id = db.nextId || 100;
  db.nextId = id + 1;
  writeDB(db);
  return id;
}

// ==================== MULTER (File Upload) ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1000)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

// ==================== AUTH MIDDLEWARE ====================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// =====================================================
//                    API ROUTES
// =====================================================

// ==================== AUTH ====================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const db = readDB();
  if (username !== db.admin.username || !bcrypt.compareSync(password, db.admin.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({
    token,
    admin: { username: db.admin.username, email: db.admin.email, name: db.admin.name }
  });
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  const db = readDB();
  res.json({ admin: { username: db.admin.username, email: db.admin.email, name: db.admin.name } });
});

// ==================== FOUND ITEMS ====================
app.get('/api/items/found', (req, res) => {
  const db = readDB();
  let items = [...db.foundItems];

  // Search filter
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(s) ||
      i.placeFound.toLowerCase().includes(s) ||
      i.location.toLowerCase().includes(s)
    );
  }

  // Sort newest first
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(items);
});

app.post('/api/items/found', upload.single('image'), (req, res) => {
  const { name, placeFound, location } = req.body;
  if (!name || !placeFound || !location) {
    return res.status(400).json({ error: 'name, placeFound, and location are required' });
  }
  const db = readDB();
  const newItem = {
    id: getNextId(),
    name,
    placeFound,
    location,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };
  // Re-read db since getNextId wrote to it
  const freshDb = readDB();
  freshDb.foundItems.push(newItem);
  writeDB(freshDb);
  res.status(201).json(newItem);
});

app.delete('/api/items/found/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id) || req.params.id;
  const item = db.foundItems.find(i => i.id === id || String(i.id) === String(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });

  // Delete associated image
  if (item.image) {
    const imgPath = path.join(__dirname, item.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  db.foundItems = db.foundItems.filter(i => i.id !== item.id);
  writeDB(db);
  res.json({ success: true });
});

// ==================== LOST ITEMS (TICKETS) ====================
app.get('/api/items/lost', (req, res) => {
  const db = readDB();
  let items = [...db.lostItems];

  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(s) ||
      i.placeLost.toLowerCase().includes(s) ||
      (i.idNo && i.idNo.toLowerCase().includes(s))
    );
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(items);
});

app.post('/api/items/lost', upload.single('image'), (req, res) => {
  const { name, placeLost, idNo, mobile, daysAgo } = req.body;
  if (!name || !placeLost || !idNo || !mobile) {
    return res.status(400).json({ error: 'name, placeLost, idNo, and mobile are required' });
  }
  const db = readDB();
  const newItem = {
    id: getNextId(),
    name,
    placeLost,
    idNo,
    mobile,
    daysAgo: daysAgo || 'Today',
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };
  const freshDb = readDB();
  freshDb.lostItems.push(newItem);
  writeDB(freshDb);
  res.status(201).json(newItem);
});

app.delete('/api/items/lost/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id) || req.params.id;
  db.lostItems = db.lostItems.filter(i => String(i.id) !== String(id));
  writeDB(db);
  res.json({ success: true });
});

// ==================== HANDOVER ITEMS ====================
app.get('/api/items/handover', (req, res) => {
  const db = readDB();
  res.json(db.handoverItems);
});

app.post('/api/items/handover', (req, res) => {
  const { name, personName, mobile } = req.body;
  if (!name || !personName) {
    return res.status(400).json({ error: 'name and personName are required' });
  }
  const db = readDB();
  const newItem = {
    id: getNextId(),
    name,
    personName,
    mobile: mobile || '',
    createdAt: new Date().toISOString()
  };
  const freshDb = readDB();
  freshDb.handoverItems.push(newItem);
  writeDB(freshDb);
  res.status(201).json(newItem);
});

app.delete('/api/items/handover/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id) || req.params.id;
  db.handoverItems = db.handoverItems.filter(i => String(i.id) !== String(id));
  writeDB(db);
  res.json({ success: true });
});

// ==================== DELIVER (handover → delivered) ====================
app.post('/api/items/deliver/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id) || req.params.id;
  const item = db.handoverItems.find(i => String(i.id) === String(id));
  if (!item) return res.status(404).json({ error: 'Item not found in handover list' });

  db.handoverItems = db.handoverItems.filter(i => String(i.id) !== String(id));
  db.deliveredItems.push({
    ...item,
    deliveredAt: new Date().toISOString()
  });
  writeDB(db);
  res.json({ success: true, item });
});

// ==================== DELIVERED ITEMS ====================
app.get('/api/items/delivered', (req, res) => {
  const db = readDB();
  const items = [...db.deliveredItems].sort((a, b) => new Date(b.deliveredAt || b.createdAt) - new Date(a.deliveredAt || a.createdAt));
  res.json(items);
});

// ==================== STATS (Admin Dashboard) ====================
app.get('/api/stats', (req, res) => {
  const db = readDB();
  res.json({
    foundItems: db.foundItems.length,
    lostItems: db.lostItems.length,
    handoverItems: db.handoverItems.length,
    deliveredItems: db.deliveredItems.length,
    totalItems: db.foundItems.length + db.lostItems.length + db.handoverItems.length + db.deliveredItems.length
  });
});

// ==================== IMAGE UPLOAD ====================
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ==================== SERVE REACT BUILD IN PRODUCTION ====================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`FindMyItem API server running on http://localhost:${PORT}`);
  console.log(`Admin credentials: username=admin, password=admin123`);
});
