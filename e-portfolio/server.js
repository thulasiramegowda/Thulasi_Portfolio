const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Create upload directories
const dirs = ['public/uploads', 'public/uploads/projects', 'public/uploads/certificates', 'public/uploads/profile', 'public/uploads/milestones'];
dirs.forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads';
    if (file.fieldname === 'project') folder = 'uploads/projects';
    else if (file.fieldname === 'certificate') folder = 'uploads/certificates';
    else if (file.fieldname === 'profile') folder = 'uploads/profile';
    else if (file.fieldname === 'milestone') folder = 'uploads/milestones';
    else if (file.fieldname === 'pdf') folder = 'uploads/certificates';
    cb(null, `public/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const dbPath = path.join(__dirname, 'data', 'db.json');

function readDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      const defaultDB = {
        profile: { 
          name: "Thulasi G T", 
          photo: null, 
          bio: "CSIT student passionate about AI and building things.", 
          tags: ["Passionate Coder", "AI Enthusiast", "Startup Explorer"], 
          socials: [
            { id: "1", platform: "github", url: "https://github.com/thulasiramegowda" },
            { id: "2", platform: "linkedin", url: "https://linkedin.com/in/thulasi-rame-gowda" },
            { id: "3", platform: "twitter", url: "https://twitter.com/thulas_21" },
            { id: "4", platform: "email", url: "mailto:thulasiramegowda29@gmail.com" }
          ] 
        },
        education: {
          currentCgpa: "9.7",
          currentSemester: "2",
          creditsCompleted: "24",
          sslc: { school: "Vidyanikethan School, Ramnathpura", percentage: "92%", year: "2023" },
          puc: { college: "Lakshya PU College, Bangalore", percentage: "94%", year: "2025" },
          btech: { university: "REVA University, Bangalore", semesters: [
            { sem: 1, sgpa: "9.7", status: "completed" },
            { sem: 2, sgpa: "", status: "in-progress" },
            { sem: 3, sgpa: "", status: "upcoming" },
            { sem: 4, sgpa: "", status: "upcoming" },
            { sem: 5, sgpa: "", status: "upcoming" },
            { sem: 6, sgpa: "", status: "upcoming" },
            { sem: 7, sgpa: "", status: "upcoming" },
            { sem: 8, sgpa: "", status: "upcoming" }
          ] }
        },
        milestones: [],
        projects: [],
        certificates: [],
        skills: { 
          programming: ["C", "Python", "SQL"], 
          learning: ["AI", "Machine Learning", "Data Science"], 
          tools: [
            { name: "GitHub", icon: "fab fa-github" },
            { name: "Docker", icon: "fab fa-docker" },
            { name: "MongoDB", icon: "fas fa-database" },
            { name: "VS Code", icon: "fas fa-code" },
            { name: "Git", icon: "fab fa-git-alt" },
            { name: "Power BI", icon: "fas fa-chart-line" },
            { name: "Kaggle", icon: "fas fa-chart-simple" },
            { name: "AI Tools", icon: "fas fa-microchip" }
          ]
        }
      };
      writeDB(defaultDB);
      return defaultDB;
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    return {};
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log('✅ Database saved');
    return true;
  } catch (error) {
    return false;
  }
}

// Profile Routes
app.get('/api/profile', (req, res) => { const db = readDB(); res.json(db.profile || {}); });
app.put('/api/profile', (req, res) => { const db = readDB(); db.profile = { ...db.profile, ...req.body }; writeDB(db); res.json({ success: true }); });
app.post('/api/upload/profile', upload.single('profile'), (req, res) => { res.json({ url: `/uploads/profile/${req.file.filename}` }); });

// Education Routes
app.get('/api/education', (req, res) => { const db = readDB(); res.json(db.education || {}); });
app.put('/api/education', (req, res) => { const db = readDB(); db.education = { ...db.education, ...req.body }; writeDB(db); res.json({ success: true }); });

// Milestones Routes
app.get('/api/milestones', (req, res) => { const db = readDB(); res.json(db.milestones || []); });
app.post('/api/milestones', (req, res) => { const db = readDB(); const newItem = { id: uuidv4(), ...req.body }; db.milestones.push(newItem); writeDB(db); res.json(newItem); });
app.put('/api/milestones/:id', (req, res) => { const db = readDB(); const index = db.milestones.findIndex(i => i.id === req.params.id); if (index !== -1) { db.milestones[index] = { ...db.milestones[index], ...req.body }; writeDB(db); res.json(db.milestones[index]); } });
app.delete('/api/milestones/:id', (req, res) => { const db = readDB(); db.milestones = db.milestones.filter(i => i.id !== req.params.id); writeDB(db); res.json({ success: true }); });
app.post('/api/upload/milestone', upload.single('milestone'), (req, res) => { res.json({ url: `/uploads/milestones/${req.file.filename}` }); });

// Projects Routes
app.get('/api/projects', (req, res) => { const db = readDB(); res.json(db.projects || []); });
app.post('/api/projects', (req, res) => { const db = readDB(); const newItem = { id: uuidv4(), ...req.body }; db.projects.push(newItem); writeDB(db); res.json(newItem); });
app.put('/api/projects/:id', (req, res) => { const db = readDB(); const index = db.projects.findIndex(i => i.id === req.params.id); if (index !== -1) { db.projects[index] = { ...db.projects[index], ...req.body }; writeDB(db); res.json(db.projects[index]); } });
app.delete('/api/projects/:id', (req, res) => { const db = readDB(); db.projects = db.projects.filter(i => i.id !== req.params.id); writeDB(db); res.json({ success: true }); });
app.post('/api/upload/project', upload.single('project'), (req, res) => { res.json({ url: `/uploads/projects/${req.file.filename}` }); });

// Certificates Routes
app.get('/api/certificates', (req, res) => { const db = readDB(); res.json(db.certificates || []); });
app.post('/api/certificates', (req, res) => { const db = readDB(); const newItem = { id: uuidv4(), ...req.body }; db.certificates.push(newItem); writeDB(db); res.json(newItem); });
app.put('/api/certificates/:id', (req, res) => { const db = readDB(); const index = db.certificates.findIndex(i => i.id === req.params.id); if (index !== -1) { db.certificates[index] = { ...db.certificates[index], ...req.body }; writeDB(db); res.json(db.certificates[index]); } });
app.delete('/api/certificates/:id', (req, res) => { const db = readDB(); db.certificates = db.certificates.filter(i => i.id !== req.params.id); writeDB(db); res.json({ success: true }); });
app.post('/api/upload/certificate', upload.single('certificate'), (req, res) => { res.json({ url: `/uploads/certificates/${req.file.filename}` }); });
app.post('/api/upload/certificate-pdf', upload.single('pdf'), (req, res) => { res.json({ url: `/uploads/certificates/${req.file.filename}` }); });

// Skills Routes
app.get('/api/skills', (req, res) => { const db = readDB(); res.json(db.skills || {}); });
app.put('/api/skills', (req, res) => { const db = readDB(); db.skills = { ...db.skills, ...req.body }; writeDB(db); res.json({ success: true }); });

// Social Links Routes
app.get('/api/socials', (req, res) => { const db = readDB(); res.json(db.profile?.socials || []); });
app.post('/api/socials', (req, res) => { const db = readDB(); const newItem = { id: uuidv4(), ...req.body }; if (!db.profile.socials) db.profile.socials = []; db.profile.socials.push(newItem); writeDB(db); res.json(newItem); });
app.put('/api/socials/:id', (req, res) => { const db = readDB(); const index = db.profile.socials.findIndex(i => i.id === req.params.id); if (index !== -1) { db.profile.socials[index] = { ...db.profile.socials[index], ...req.body }; writeDB(db); res.json(db.profile.socials[index]); } });
app.delete('/api/socials/:id', (req, res) => { const db = readDB(); db.profile.socials = db.profile.socials.filter(i => i.id !== req.params.id); writeDB(db); res.json({ success: true }); });

app.post('/api/admin/login', (req, res) => { res.json({ success: true }); });

app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║  🚀 PORTFOLIO RUNNING               ║`);
  console.log(`║  🌐 http://localhost:${PORT}          ║`);
  console.log(`║  🔑 Admin Password: admin123        ║`);
  console.log(`╚══════════════════════════════════════╝\n`);
});