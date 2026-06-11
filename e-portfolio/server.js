const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Create upload directories
const dirs = ['public/uploads', 'public/uploads/profile', 'public/uploads/projects', 'public/uploads/certificates', 'public/uploads/creative'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Database setup
const db = new sqlite3.Database('portfolio.db');

// Create tables with NO fake data - all empty
db.serialize(() => {
  // Profile table
  db.run(`DROP TABLE IF EXISTS profile`);
  db.run(`CREATE TABLE profile (
    id INTEGER PRIMARY KEY, 
    name TEXT, 
    tagline TEXT, 
    bio TEXT, 
    photo_url TEXT, 
    resume_url TEXT
  )`);
  db.run(`INSERT INTO profile (id, name, tagline, bio) VALUES (1, '', '', '')`);

  // Journey table
  db.run(`DROP TABLE IF EXISTS journey`);
  db.run(`CREATE TABLE journey (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    year TEXT, 
    title TEXT, 
    description TEXT, 
    "order" INTEGER
  )`);
  // NO fake data - empty table

  // Projects table
  db.run(`DROP TABLE IF EXISTS projects`);
  db.run(`CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    description TEXT, 
    tech TEXT, 
    github_url TEXT, 
    demo_url TEXT, 
    image_url TEXT, 
    learnings TEXT, 
    "order" INTEGER
  )`);
  // NO fake data - empty table

  // Skills table
  db.run(`DROP TABLE IF EXISTS skills`);
  db.run(`CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    category TEXT, 
    items TEXT, 
    "order" INTEGER
  )`);
  // NO fake data - empty table

  // Certifications table
  db.run(`DROP TABLE IF EXISTS certifications`);
  db.run(`CREATE TABLE certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    issuer TEXT, 
    date TEXT, 
    image_url TEXT, 
    verification_url TEXT, 
    "order" INTEGER
  )`);
  // NO fake data - empty table

  // Achievements table
  db.run(`DROP TABLE IF EXISTS achievements`);
  db.run(`CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    event TEXT, 
    year TEXT, 
    description TEXT, 
    "order" INTEGER
  )`);
  // NO fake data - empty table

  // Creative table
  db.run(`DROP TABLE IF EXISTS creative`);
  db.run(`CREATE TABLE creative (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    image_url TEXT, 
    "order" INTEGER
  )`);
  // NO fake data - empty table

  // Roadmap table
  db.run(`DROP TABLE IF EXISTS roadmap`);
  db.run(`CREATE TABLE roadmap (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    goal TEXT, 
    status TEXT, 
    target TEXT, 
    "order" INTEGER
  )`);
  // NO fake data - empty table

  // Social Links table
  db.run(`DROP TABLE IF EXISTS social_links`);
  db.run(`CREATE TABLE social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    platform TEXT, 
    url TEXT
  )`);
  // NO fake data - empty table

  console.log('✅ Database created - ALL TABLES EMPTY (no fake data)');
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads';
    if (file.fieldname === 'profile') folder = 'uploads/profile';
    else if (file.fieldname === 'project') folder = 'uploads/projects';
    else if (file.fieldname === 'certificate') folder = 'uploads/certificates';
    else if (file.fieldname === 'creative') folder = 'uploads/creative';
    cb(null, `public/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ============ API ROUTES ============

// Profile
app.get('/api/profile', (req, res) => {
  db.get(`SELECT * FROM profile WHERE id = 1`, (err, row) => {
    res.json(row || {});
  });
});

app.put('/api/profile', (req, res) => {
  const { name, tagline, bio } = req.body;
  db.run(`UPDATE profile SET name = ?, tagline = ?, bio = ? WHERE id = 1`, [name, tagline, bio]);
  res.json({ success: true });
});

app.post('/api/upload/profile', upload.single('profile'), (req, res) => {
  const url = `/uploads/profile/${req.file.filename}`;
  db.run(`UPDATE profile SET photo_url = ? WHERE id = 1`, [url]);
  res.json({ url });
});

app.post('/api/upload/resume', upload.single('resume'), (req, res) => {
  const url = `/uploads/resume/${req.file.filename}`;
  db.run(`UPDATE profile SET resume_url = ? WHERE id = 1`, [url]);
  res.json({ url });
});

// Journey - CRUD
app.get('/api/journey', (req, res) => {
  db.all(`SELECT * FROM journey ORDER BY "order" ASC`, (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/journey', (req, res) => {
  const { year, title, description, order } = req.body;
  db.run(`INSERT INTO journey (year, title, description, "order") VALUES (?, ?, ?, ?)`, 
    [year, title, description, order || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, success: true });
  });
});

app.put('/api/journey/:id', (req, res) => {
  const { year, title, description, order } = req.body;
  db.run(`UPDATE journey SET year = ?, title = ?, description = ?, "order" = ? WHERE id = ?`, 
    [year, title, description, order, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/journey/:id', (req, res) => {
  db.run(`DELETE FROM journey WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

// Projects - CRUD
app.get('/api/projects', (req, res) => {
  db.all(`SELECT * FROM projects ORDER BY "order" ASC`, (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/projects', (req, res) => {
  const { title, description, tech, github_url, demo_url, image_url, learnings, order } = req.body;
  db.run(`INSERT INTO projects (title, description, tech, github_url, demo_url, image_url, learnings, "order") VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [title, description, tech, github_url, demo_url, image_url, learnings, order || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, success: true });
  });
});

app.put('/api/projects/:id', (req, res) => {
  const { title, description, tech, github_url, demo_url, image_url, learnings, order } = req.body;
  db.run(`UPDATE projects SET title = ?, description = ?, tech = ?, github_url = ?, demo_url = ?, image_url = ?, learnings = ?, "order" = ? WHERE id = ?`, 
    [title, description, tech, github_url, demo_url, image_url, learnings, order, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/projects/:id', (req, res) => {
  db.run(`DELETE FROM projects WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

app.post('/api/upload/project', upload.single('project'), (req, res) => {
  res.json({ url: `/uploads/projects/${req.file.filename}` });
});

// Skills - CRUD
app.get('/api/skills', (req, res) => {
  db.all(`SELECT * FROM skills ORDER BY "order" ASC`, (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/skills', (req, res) => {
  const { category, items, order } = req.body;
  db.run(`INSERT INTO skills (category, items, "order") VALUES (?, ?, ?)`, 
    [category, items, order || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, success: true });
  });
});

app.put('/api/skills/:id', (req, res) => {
  const { category, items, order } = req.body;
  db.run(`UPDATE skills SET category = ?, items = ?, "order" = ? WHERE id = ?`, 
    [category, items, order, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/skills/:id', (req, res) => {
  db.run(`DELETE FROM skills WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

// Certifications - CRUD
app.get('/api/certifications', (req, res) => {
  db.all(`SELECT * FROM certifications ORDER BY "order" ASC`, (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/certifications', (req, res) => {
  const { title, issuer, date, verification_url, order } = req.body;
  db.run(`INSERT INTO certifications (title, issuer, date, verification_url, "order") VALUES (?, ?, ?, ?, ?)`, 
    [title, issuer, date, verification_url, order || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, success: true });
  });
});

app.put('/api/certifications/:id', (req, res) => {
  const { title, issuer, date, verification_url, order } = req.body;
  db.run(`UPDATE certifications SET title = ?, issuer = ?, date = ?, verification_url = ?, "order" = ? WHERE id = ?`, 
    [title, issuer, date, verification_url, order, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/certifications/:id', (req, res) => {
  db.run(`DELETE FROM certifications WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

app.post('/api/upload/certificate', upload.single('certificate'), (req, res) => {
  res.json({ url: `/uploads/certificates/${req.file.filename}` });
});

// Achievements - CRUD
app.get('/api/achievements', (req, res) => {
  db.all(`SELECT * FROM achievements ORDER BY "order" ASC`, (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/achievements', (req, res) => {
  const { title, event, year, description, order } = req.body;
  db.run(`INSERT INTO achievements (title, event, year, description, "order") VALUES (?, ?, ?, ?, ?)`, 
    [title, event, year, description, order || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, success: true });
  });
});

app.put('/api/achievements/:id', (req, res) => {
  const { title, event, year, description, order } = req.body;
  db.run(`UPDATE achievements SET title = ?, event = ?, year = ?, description = ?, "order" = ? WHERE id = ?`, 
    [title, event, year, description, order, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/achievements/:id', (req, res) => {
  db.run(`DELETE FROM achievements WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

// Creative - CRUD
app.get('/api/creative', (req, res) => {
  db.all(`SELECT * FROM creative ORDER BY "order" ASC`, (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/creative', (req, res) => {
  const { title, order } = req.body;
  db.run(`INSERT INTO creative (title, "order") VALUES (?, ?)`, [title, order || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, success: true });
  });
});

app.put('/api/creative/:id', (req, res) => {
  const { title, order } = req.body;
  db.run(`UPDATE creative SET title = ?, "order" = ? WHERE id = ?`, [title, order, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/creative/:id', (req, res) => {
  db.run(`DELETE FROM creative WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

app.post('/api/upload/creative', upload.single('creative'), (req, res) => {
  res.json({ url: `/uploads/creative/${req.file.filename}` });
});

// Roadmap - CRUD
app.get('/api/roadmap', (req, res) => {
  db.all(`SELECT * FROM roadmap ORDER BY "order" ASC`, (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/roadmap', (req, res) => {
  const { goal, status, target, order } = req.body;
  db.run(`INSERT INTO roadmap (goal, status, target, "order") VALUES (?, ?, ?, ?)`, 
    [goal, status, target, order || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, success: true });
  });
});

app.put('/api/roadmap/:id', (req, res) => {
  const { goal, status, target, order } = req.body;
  db.run(`UPDATE roadmap SET goal = ?, status = ?, target = ?, "order" = ? WHERE id = ?`, 
    [goal, status, target, order, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/roadmap/:id', (req, res) => {
  db.run(`DELETE FROM roadmap WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

// Social Links - CRUD
app.get('/api/social', (req, res) => {
  db.all(`SELECT * FROM social_links`, (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/social', (req, res) => {
  const { platform, url } = req.body;
  db.run(`INSERT INTO social_links (platform, url) VALUES (?, ?)`, [platform, url], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, success: true });
  });
});

app.put('/api/social/:id', (req, res) => {
  const { platform, url } = req.body;
  db.run(`UPDATE social_links SET platform = ?, url = ? WHERE id = ?`, [platform, url, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/social/:id', (req, res) => {
  db.run(`DELETE FROM social_links WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

// Simple admin login (any credentials work for demo)
app.post('/api/admin/login', (req, res) => {
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║  ✨ PORTFOLIO SERVER RUNNING        ║`);
  console.log(`║                                      ║`);
  console.log(`║  🌐 http://localhost:${PORT}          ║`);
  console.log(`║                                      ║`);
  console.log(`║  📝 ALL TABLES ARE EMPTY             ║`);
  console.log(`║  ➕ Add YOUR real data via UI        ║`);
  console.log(`╚══════════════════════════════════════╝\n`);
});