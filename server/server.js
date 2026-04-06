const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'findmyitem-klu-secret-2024';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'nihanth1006';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Nihanth@2006#';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@klu.edu.in';
const ADMIN_NAME = process.env.ADMIN_NAME || 'KL Admin';
const DATABASE_URL = process.env.DATABASE_URL;
const DB_SSL_ENABLED = process.env.DB_SSL === 'true';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Set it in your environment before starting the server.');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DB_SSL_ENABLED ? { rejectUnauthorized: false } : false
});

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function mapAdmin(row) {
  return {
    username: row.username,
    email: row.email,
    name: row.name
  };
}

function mapFoundItem(row) {
  return {
    id: row.id,
    name: row.name,
    placeFound: row.place_found,
    location: row.location,
    image: row.image,
    createdAt: row.created_at
  };
}

function mapLostItem(row) {
  return {
    id: row.id,
    name: row.name,
    placeLost: row.place_lost,
    idNo: row.id_no,
    mobile: row.mobile,
    daysAgo: row.days_ago,
    image: row.image,
    createdAt: row.created_at
  };
}

function mapHandoverItem(row) {
  return {
    id: row.id,
    name: row.name,
    personName: row.person_name,
    mobile: row.mobile,
    createdAt: row.created_at
  };
}

function mapDeliveredItem(row) {
  return {
    id: row.id,
    name: row.name,
    personName: row.person_name,
    mobile: row.mobile,
    deliveredAt: row.delivered_at
  };
}

function toUploadPath(file) {
  return file ? `/uploads/${file.filename}` : null;
}

async function query(text, params = []) {
  return pool.query(text, params);
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email VARCHAR(255),
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS found_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      place_found VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lost_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      place_lost VARCHAR(255) NOT NULL,
      id_no VARCHAR(100) NOT NULL,
      mobile VARCHAR(30) NOT NULL,
      days_ago VARCHAR(100),
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS handover_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      person_name VARCHAR(255) NOT NULL,
      mobile VARCHAR(30),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS delivered_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      person_name VARCHAR(255) NOT NULL,
      mobile VARCHAR(30),
      delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function ensureAdminCredentials() {
  const result = await query('SELECT * FROM admins WHERE username = $1 LIMIT 1', [ADMIN_USERNAME]);
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);

  if (result.rows.length === 0) {
    await query(
      `
        INSERT INTO admins (username, password_hash, email, name)
        VALUES ($1, $2, $3, $4)
      `,
      [ADMIN_USERNAME, passwordHash, ADMIN_EMAIL, ADMIN_NAME]
    );
    return;
  }

  const current = result.rows[0];
  const passwordMatches = bcrypt.compareSync(ADMIN_PASSWORD, current.password_hash);

  if (!passwordMatches || current.email !== ADMIN_EMAIL || current.name !== ADMIN_NAME) {
    await query(
      `
        UPDATE admins
        SET password_hash = $2, email = $3, name = $4
        WHERE username = $1
      `,
      [ADMIN_USERNAME, passwordHash, ADMIN_EMAIL, ADMIN_NAME]
    );
  }
}

// ==================== MULTER (File Upload) ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1000)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await query('SELECT * FROM admins WHERE username = $1 LIMIT 1', [username]);
    const admin = result.rows[0];

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      token,
      admin: mapAdmin(admin)
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/verify', authMiddleware, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM admins WHERE username = $1 LIMIT 1', [req.admin.username]);
    const admin = result.rows[0];
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ admin: mapAdmin(admin) });
  } catch (error) {
    next(error);
  }
});

// ==================== FOUND ITEMS ====================
app.get('/api/items/found', async (req, res, next) => {
  try {
    const search = req.query.search?.trim();
    const params = [];
    let sql = `
      SELECT id, name, place_found, location, image, created_at
      FROM found_items
    `;

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += `
        WHERE LOWER(name) LIKE $1
           OR LOWER(place_found) LIKE $1
           OR LOWER(location) LIKE $1
      `;
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows.map(mapFoundItem));
  } catch (error) {
    next(error);
  }
});

app.post('/api/items/found', upload.single('image'), async (req, res, next) => {
  try {
    const { name, placeFound, location } = req.body;
    if (!name || !placeFound || !location) {
      return res.status(400).json({ error: 'name, placeFound, and location are required' });
    }

    const result = await query(
      `
        INSERT INTO found_items (name, place_found, location, image)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, place_found, location, image, created_at
      `,
      [name, placeFound, location, toUploadPath(req.file)]
    );

    res.status(201).json(mapFoundItem(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/items/found/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM found_items WHERE id = $1 RETURNING image', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const image = result.rows[0].image;
    if (image) {
      const imageFile = path.join(__dirname, image.replace(/^\/+/, ''));
      if (fs.existsSync(imageFile)) {
        fs.unlinkSync(imageFile);
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ==================== LOST ITEMS ====================
app.get('/api/items/lost', async (req, res, next) => {
  try {
    const search = req.query.search?.trim();
    const params = [];
    let sql = `
      SELECT id, name, place_lost, id_no, mobile, days_ago, image, created_at
      FROM lost_items
    `;

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += `
        WHERE LOWER(name) LIKE $1
           OR LOWER(place_lost) LIKE $1
           OR LOWER(id_no) LIKE $1
      `;
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows.map(mapLostItem));
  } catch (error) {
    next(error);
  }
});

app.post('/api/items/lost', upload.single('image'), async (req, res, next) => {
  try {
    const { name, placeLost, idNo, mobile, daysAgo } = req.body;
    if (!name || !placeLost || !idNo || !mobile) {
      return res.status(400).json({ error: 'name, placeLost, idNo, and mobile are required' });
    }

    const result = await query(
      `
        INSERT INTO lost_items (name, place_lost, id_no, mobile, days_ago, image)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, place_lost, id_no, mobile, days_ago, image, created_at
      `,
      [name, placeLost, idNo, mobile, daysAgo || 'Today', toUploadPath(req.file)]
    );

    res.status(201).json(mapLostItem(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/items/lost/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM lost_items WHERE id = $1 RETURNING image', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const image = result.rows[0].image;
    if (image) {
      const imageFile = path.join(__dirname, image.replace(/^\/+/, ''));
      if (fs.existsSync(imageFile)) {
        fs.unlinkSync(imageFile);
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ==================== HANDOVER ITEMS ====================
app.get('/api/items/handover', async (req, res, next) => {
  try {
    const result = await query(
      `
        SELECT id, name, person_name, mobile, created_at
        FROM handover_items
        ORDER BY created_at DESC
      `
    );
    res.json(result.rows.map(mapHandoverItem));
  } catch (error) {
    next(error);
  }
});

app.post('/api/items/handover', async (req, res, next) => {
  try {
    const { name, personName, mobile } = req.body;
    if (!name || !personName) {
      return res.status(400).json({ error: 'name and personName are required' });
    }

    const result = await query(
      `
        INSERT INTO handover_items (name, person_name, mobile)
        VALUES ($1, $2, $3)
        RETURNING id, name, person_name, mobile, created_at
      `,
      [name, personName, mobile || '']
    );

    res.status(201).json(mapHandoverItem(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/items/handover/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM handover_items WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ==================== DELIVER (handover → delivered) ====================
app.post('/api/items/deliver/:id', async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const handoverResult = await client.query(
      `
        DELETE FROM handover_items
        WHERE id = $1
        RETURNING id, name, person_name, mobile, created_at
      `,
      [req.params.id]
    );

    if (handoverResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Item not found in handover list' });
    }

    const item = handoverResult.rows[0];
    const deliveredResult = await client.query(
      `
        INSERT INTO delivered_items (name, person_name, mobile, delivered_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING id, name, person_name, mobile, delivered_at
      `,
      [item.name, item.person_name, item.mobile]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      item: mapDeliveredItem(deliveredResult.rows[0])
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// ==================== DELIVERED ITEMS ====================
app.get('/api/items/delivered', async (req, res, next) => {
  try {
    const result = await query(
      `
        SELECT id, name, person_name, mobile, delivered_at
        FROM delivered_items
        ORDER BY delivered_at DESC
      `
    );
    res.json(result.rows.map(mapDeliveredItem));
  } catch (error) {
    next(error);
  }
});

// ==================== STATS ====================
app.get('/api/stats', async (req, res, next) => {
  try {
    const [found, lost, handover, delivered] = await Promise.all([
      query('SELECT COUNT(*)::int AS count FROM found_items'),
      query('SELECT COUNT(*)::int AS count FROM lost_items'),
      query('SELECT COUNT(*)::int AS count FROM handover_items'),
      query('SELECT COUNT(*)::int AS count FROM delivered_items')
    ]);

    const foundItems = found.rows[0].count;
    const lostItems = lost.rows[0].count;
    const handoverItems = handover.rows[0].count;
    const deliveredItems = delivered.rows[0].count;

    res.json({
      foundItems,
      lostItems,
      handoverItems,
      deliveredItems,
      totalItems: foundItems + lostItems + handoverItems + deliveredItems
    });
  } catch (error) {
    next(error);
  }
});

// ==================== IMAGE UPLOAD ====================
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ==================== SERVE REACT BUILD IN PRODUCTION ====================
if (process.env.SERVE_FRONTEND === 'true') {
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
async function startServer() {
  await ensureSchema();
  await ensureAdminCredentials();

  app.listen(PORT, () => {
    console.log(`FindMyItem API server running on http://localhost:${PORT}`);
    console.log(`Admin credentials: username=${ADMIN_USERNAME}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
