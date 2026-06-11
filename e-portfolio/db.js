const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Initialize database tables
db.serialize(() => {
  // Admin user
  db.run(`CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // Profile
  db.run(`CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    tagline TEXT,
    bio TEXT,
    photo_url TEXT,
    resume_url TEXT
  )`);

  // Journey milestones
  db.run(`CREATE TABLE IF NOT EXISTS journey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT,
    title TEXT,
    description TEXT,
    "order" INTEGER
  )`);

  // Academics
  db.run(`CREATE TABLE IF NOT EXISTS academics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    label TEXT,
    value TEXT,
    year TEXT,
    semester INTEGER,
    sgpa TEXT,
    cgpa TEXT,
    marksheet_url TEXT,
    "order" INTEGER
  )`);

  // Experiences
  db.run(`CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    position TEXT,
    company TEXT,
    duration TEXT,
    description TEXT,
    certificate_url TEXT,
    "order" INTEGER
  )`);

  // Projects
  db.run(`CREATE TABLE IF NOT EXISTS projects (
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

  // Skills
  db.run(`CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    items TEXT,
    "order" INTEGER
  )`);

  // Certifications
  db.run(`CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    issuer TEXT,
    date TEXT,
    image_url TEXT,
    verification_url TEXT,
    "order" INTEGER
  )`);

  // Achievements
  db.run(`CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    event TEXT,
    year TEXT,
    description TEXT,
    "order" INTEGER
  )`);

  // Creative works
  db.run(`CREATE TABLE IF NOT EXISTS creative (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image_url TEXT,
    "order" INTEGER
  )`);

  // Blogs
  db.run(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    summary TEXT,
    content TEXT,
    date TEXT,
    read_time TEXT,
    "order" INTEGER
  )`);

  // Roadmap
  db.run(`CREATE TABLE IF NOT EXISTS roadmap (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal TEXT,
    status TEXT,
    target TEXT,
    "order" INTEGER
  )`);

  // Social links
  db.run(`CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT,
    url TEXT
  )`);

  // Insert default admin if not exists
  const bcrypt = require('bcryptjs');
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO admin (id, username, password) VALUES (1, 'admin', ?)`, [defaultPassword]);

  // Insert default profile if not exists
  db.get(`SELECT * FROM profile WHERE id = 1`, (err, row) => {
    if (!row) {
      db.run(`INSERT INTO profile (id, name, tagline, bio) VALUES (1, 'Thulasi Rame Gowda', 'CSIT Student • Full-Stack Developer • AI & Data Enthusiast', 'I build practical software, explore AI/ML, and create digital experiences that blend engineering precision with creative thinking.')`);
    }
  });
});

module.exports = db;