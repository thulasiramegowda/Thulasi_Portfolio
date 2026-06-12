// ============ LOAD ALL DATA ============
async function loadData() {
  try {
    const [profile, education, milestones, projects, certificates, skills, socials] = await Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/education').then(r => r.json()),
      fetch('/api/milestones').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/certificates').then(r => r.json()),
      fetch('/api/skills').then(r => r.json()),
      fetch('/api/socials').then(r => r.json())
    ]);
    
    renderProfile(profile, socials);
    renderEducation(education);
    renderMilestones(milestones);
    renderSkills(skills);
    renderProjects(projects);
    renderCertificates(certificates);
    renderContact(socials);
    renderAcademicStats(education);
    
    const img = document.querySelector('.photo-inner img');
    if (img && profile.photo && profile.photo !== 'null') {
      img.src = profile.photo;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// ============ RENDER PROFILE ============
function renderProfile(profile, socials) {
  const bioEl = document.getElementById('aboutBio');
  if (bioEl) bioEl.textContent = profile.bio || 'CSIT student passionate about Artificial Intelligence, innovation, and entrepreneurship.';
  
  const badges = document.getElementById('identityBadges');
  if (badges && profile.tags) {
    badges.innerHTML = profile.tags.map(tag => `<span class="identity-tag">${escapeHtml(tag)}</span>`).join('');
  }
  
  const sidebar = document.getElementById('socialSidebar');
  if (sidebar && socials) {
    sidebar.innerHTML = socials.map(s => `
      <a href="${s.url}" class="contact-item" target="_blank">
        <i class="fab fa-${s.platform === 'linkedin' ? 'linkedin-in' : s.platform === 'email' ? 'envelope' : s.platform}"></i>
        <span>${s.platform === 'email' ? s.url.replace('mailto:', '') : s.url.split('//')[1]?.split('/')[0] || s.platform}</span>
      </a>
    `).join('');
  }
}

// ============ RENDER EDUCATION (YOUR REAL DATA) ============
function renderEducation(education) {
  const container = document.getElementById('educationContainer');
  if (!container) return;
  
  // YOUR REAL EDUCATION DATA - No fake data
  const sslcSchool = education.sslc?.school || "Vidyanikethan School, Ramnathpura";
  const sslcPercent = education.sslc?.percentage || "92%";
  const pucCollege = education.puc?.college || "Lakshya PU College, Bangalore";
  const pucPercent = education.puc?.percentage || "94%";
  const btechUniv = education.btech?.university || "REVA University, Bangalore";
  
  container.innerHTML = `
    <div class="edu-timeline">
      <div class="edu-item">
        <div class="edu-year">2023</div>
        <div class="edu-content">
          <h3>SSLC</h3>
          <p>${escapeHtml(sslcSchool)}</p>
          <span class="edu-badge">${escapeHtml(sslcPercent)}</span>
        </div>
      </div>
      <div class="edu-item">
        <div class="edu-year">2025</div>
        <div class="edu-content">
          <h3>PUC (PCME)</h3>
          <p>${escapeHtml(pucCollege)}</p>
          <span class="edu-badge">${escapeHtml(pucPercent)}</span>
        </div>
      </div>
      <div class="edu-item">
        <div class="edu-year">2025 - Present</div>
        <div class="edu-content">
          <h3>B.Tech CSIT</h3>
          <p>${escapeHtml(btechUniv)}</p>
          <div class="semester-progress" id="semesterProgress"></div>
        </div>
      </div>
    </div>
  `;
  
  // Render semesters
  const semContainer = document.getElementById('semesterProgress');
  if (semContainer) {
    const semesters = education.btech?.semesters || [
      { sem: 1, sgpa: "9.7", status: "completed" },
      { sem: 2, sgpa: "", status: "in-progress" },
      { sem: 3, sgpa: "", status: "upcoming" },
      { sem: 4, sgpa: "", status: "upcoming" },
      { sem: 5, sgpa: "", status: "upcoming" },
      { sem: 6, sgpa: "", status: "upcoming" },
      { sem: 7, sgpa: "", status: "upcoming" },
      { sem: 8, sgpa: "", status: "upcoming" }
    ];
    semContainer.innerHTML = semesters.map(s => `
      <div class="sem-badge ${s.status}">
        Sem ${s.sem}: ${s.sgpa || '—'} ${s.status === 'completed' ? '✓' : s.status === 'in-progress' ? '⚡' : '🔒'}
      </div>
    `).join('');
  }
}

// ============ RENDER ACADEMIC STATS ============
function renderAcademicStats(education) {
  const cgpaEl = document.getElementById('currentCgpa');
  const semEl = document.getElementById('currentSem');
  const creditsEl = document.getElementById('creditsDone');
  const journey = document.getElementById('semesterJourney');
  
  if (cgpaEl) cgpaEl.innerText = education.currentCgpa || '9.7';
  const semNum = education.currentSemester || '2';
  if (semEl) semEl.innerText = semNum + (semNum === '1' ? 'st' : semNum === '2' ? 'nd' : 'th');
  if (creditsEl) creditsEl.innerText = education.creditsCompleted || '24';
  
  const semesters = education.btech?.semesters || [
    { sem: 1, sgpa: "9.7", status: "completed" },
    { sem: 2, sgpa: "", status: "in-progress" },
    { sem: 3, sgpa: "", status: "upcoming" },
    { sem: 4, sgpa: "", status: "upcoming" },
    { sem: 5, sgpa: "", status: "upcoming" },
    { sem: 6, sgpa: "", status: "upcoming" },
    { sem: 7, sgpa: "", status: "upcoming" },
    { sem: 8, sgpa: "", status: "upcoming" }
  ];
  
  if (journey) {
    journey.innerHTML = semesters.map(s => `
      <div class="sem-card ${s.status}">
        <div class="sem-num">Sem ${s.sem}</div>
        <div class="sem-sgpa">${s.sgpa || '—'}</div>
        <div class="sem-status">${s.status === 'completed' ? '✓' : s.status === 'in-progress' ? '⚡' : '🔒'}</div>
      </div>
    `).join('');
  }
}

// ============ RENDER MILESTONES (YOUR REAL MILESTONES) ============
function renderMilestones(milestones) {
  const container = document.getElementById('milestonesContainer');
  if (!container) return;
  
  if (!milestones || milestones.length === 0) {
    container.innerHTML = '<div class="empty-state">Your engineering journey milestones will appear here. Start documenting your journey through the dashboard.</div>';
    return;
  }
  
  container.innerHTML = milestones.sort((a,b) => (a.order || 0) - (b.order || 0)).map(m => `
    <div class="milestone-card">
      <div class="milestone-year">${escapeHtml(m.year || '—')}</div>
      <div class="milestone-icon"><i class="${m.icon || 'fas fa-star'}"></i></div>
      <div class="milestone-info">
        <h4>${escapeHtml(m.title)}</h4>
        <p>${escapeHtml(m.description)}</p>
        <span class="milestone-status ${m.status || 'planned'}">${m.status === 'completed' ? '✓ Completed' : m.status === 'in-progress' ? '⚡ In Progress' : '📋 Planned'}</span>
      </div>
    </div>
  `).join('');
}

// ============ RENDER SKILLS (YOUR REAL SKILLS) ============
function renderSkills(skills) {
  const prog = document.getElementById('programmingSkills');
  const learn = document.getElementById('learningSkills');
  const tools = document.getElementById('toolsGrid');
  
  // YOUR REAL SKILLS - No fake data
  const programmingSkills = skills.programming || ["C", "Python", "SQL"];
  const learningSkills = skills.learning || ["Artificial Intelligence", "Machine Learning", "Data Science", "Generative AI", "Web Technologies"];
  const toolsList = skills.tools || [
    { name: "GitHub", icon: "fab fa-github" },
    { name: "Docker", icon: "fab fa-docker" },
    { name: "MongoDB", icon: "fas fa-database" },
    { name: "VS Code", icon: "fas fa-code" },
    { name: "Git", icon: "fab fa-git-alt" },
    { name: "Power BI", icon: "fas fa-chart-line" },
    { name: "Kaggle", icon: "fas fa-chart-simple" },
    { name: "AI Tools", icon: "fas fa-microchip" }
  ];
  
  if (prog) prog.innerHTML = programmingSkills.map(s => `<span class="chip">${escapeHtml(s)}</span>`).join('');
  if (learn) learn.innerHTML = learningSkills.map(s => `<span class="chip">${escapeHtml(s)}</span>`).join('');
  if (tools) tools.innerHTML = toolsList.map(t => `<div class="tool-card"><i class="${t.icon}"></i><span>${escapeHtml(t.name)}</span></div>`).join('');
}

// ============ RENDER PROJECTS ============
function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  
  if (projects && projects.length > 0) {
    grid.innerHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-image">${p.image ? `<img src="${p.image}">` : '<i class="fas fa-code"></i>'}</div>
        <div class="project-info">
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.description?.substring(0,100))}...</p>
          <div class="project-tech">${(p.tech || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}</div>
          ${p.github ? `<a href="${p.github}" class="project-link" target="_blank">GitHub →</a>` : ''}
        </div>
      </div>
    `).join('');
  } else {
    grid.innerHTML = '<div class="empty-state">No projects yet. Add via Admin Panel.</div>';
  }
}

// ============ RENDER CERTIFICATES ============
function renderCertificates(certificates) {
  const grid = document.getElementById('certsGrid');
  if (!grid) return;
  
  if (certificates && certificates.length > 0) {
    grid.innerHTML = certificates.map(c => `
      <div class="cert-card" onclick="openLightbox('${c.image}')">
        <div class="cert-image">${c.image ? `<img src="${c.image}">` : '<i class="fas fa-certificate"></i>'}</div>
        <div class="cert-info"><h4>${escapeHtml(c.title)}</h4><p>${escapeHtml(c.issuer)} • ${c.date}</p></div>
      </div>
    `).join('');
  } else {
    grid.innerHTML = '<div class="empty-state">No certificates yet. Add via Admin Panel.</div>';
  }
}

// ============ RENDER CONTACT ============
function renderContact(socials) {
  const grid = document.getElementById('contactGrid');
  if (grid && socials) {
    const icons = { github: 'fab fa-github', linkedin: 'fab fa-linkedin-in', twitter: 'fab fa-twitter', email: 'fas fa-envelope' };
    grid.innerHTML = socials.map(s => `
      <a href="${s.url}" class="contact-card" target="_blank">
        <i class="${icons[s.platform] || 'fas fa-link'}"></i>
        <h4>${s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}</h4>
        <p>${s.platform === 'email' ? s.url.replace('mailto:', '') : s.url.split('//')[1]?.split('/')[0] || s.platform}</p>
      </a>
    `).join('');
  }
}

// ============ EDIT ACADEMIC STATS ============
window.editAcademicStat = (type) => {
  let promptMsg = '';
  if (type === 'cgpa') promptMsg = 'Enter new CGPA:';
  else if (type === 'semester') promptMsg = 'Enter current semester number:';
  else promptMsg = 'Enter credits completed:';
  
  const val = prompt(promptMsg);
  if (val) {
    const updateData = {};
    if (type === 'cgpa') updateData.currentCgpa = val;
    else if (type === 'semester') updateData.currentSemester = val;
    else updateData.creditsCompleted = val;
    
    fetch('/api/education', { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(updateData) 
    }).then(() => location.reload());
  }
};

// ============ EMAIL CONTACT FORM ============
const emailForm = document.getElementById('emailContactForm');
if (emailForm) {
  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;
    const subject = document.getElementById('messageSubject').value;
    const message = document.getElementById('senderMessage').value;
    const status = document.getElementById('emailFormStatus');
    
    status.innerHTML = 'Sending...';
    status.style.color = '#F5C542';
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      
      if (res.ok) {
        status.innerHTML = '✓ Message sent! I will get back to you soon.';
        status.style.color = '#4CAF50';
        emailForm.reset();
        setTimeout(() => status.innerHTML = '', 5000);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      status.innerHTML = '✗ Failed to send. Please try again.';
      status.style.color = '#FF6B6B';
    }
  });
}

// ============ HELPER FUNCTIONS ============
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : m === '>' ? '&gt;' : m);
}

function openLightbox(src) { 
  if(src){ 
    const lb = document.getElementById('lightbox'); 
    const img = document.getElementById('lightboxImg');
    if(lb && img) {
      img.src = src; 
      lb.classList.add('active');
    }
  } 
}

function closeLightbox() { 
  document.getElementById('lightbox')?.classList.remove('active'); 
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.editAcademicStat = editAcademicStat;

// ============ EVENT LISTENERS ============
document.querySelector('.lightbox .close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox')?.addEventListener('click', (e) => { 
  if(e.target === e.currentTarget) closeLightbox(); 
});

// ============ INITIALIZE ============
loadData();