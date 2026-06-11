const projectsData = [
  {
    title: "Krishi Setu",
    description: "An agriculture-focused solution designed to connect technology with farming needs. The project focuses on improving accessibility to agricultural information and providing practical support for farmers through digital solutions.",
    category: "Academic Project",
    tech: ["Research", "Problem Solving", "Agriculture Tech"]
  },
  {
    title: "Emergency Resource Allocation System",
    description: "A smart resource allocation system designed to improve emergency response by efficiently distributing available resources during critical situations.",
    category: "Academic Project",
    tech: ["Optimization", "Resource Management", "Decision Support"]
  }
];

const certificationsData = [
  { title: "Python for Data Science", issuer: "IBM", date: "April 2026", image: "assets/certificates/cert1.jpg" },
  { title: "Data Analysis Using Python", issuer: "IBM", date: "April 2026", image: "assets/certificates/cert2.jpg" },
  { title: "Data Visualization Using Python", issuer: "IBM", date: "April 2026", image: "assets/certificates/cert3.jpg" }
];

const contactData = [
  { icon: "fab fa-github", title: "GitHub", text: "github.com/thulasiramegowda", link: "https://github.com/thulasiramegowda" },
  { icon: "fab fa-linkedin-in", title: "LinkedIn", text: "linkedin.com/in/thulasi-rame-gowda", link: "https://www.linkedin.com/in/thulasi-rame-gowda-014374382" },
  { icon: "fab fa-twitter", title: "Twitter", text: "@thulas_21", link: "https://twitter.com/thulas_21" },
  { icon: "fas fa-envelope", title: "Email", text: "thulasiramegowda29@gmail.com", link: "mailto:thulasiramegowda29@gmail.com" }
];

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = projectsData.map(p => `
    <div class="project-card">
      <div class="project-image"><i class="fas fa-code" style="font-size:2rem;color:#888"></i></div>
      <div class="project-info">
        <div class="project-category">${p.category}</div>
        <h3>${p.title}</h3>
        <p>${p.description.substring(0, 120)}...</p>
        <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
        <a href="#" class="project-link">Learn More →</a>
      </div>
    </div>
  `).join('');
}

function renderCertifications() {
  const grid = document.getElementById('certsGrid');
  if (!grid) return;
  grid.innerHTML = certificationsData.map(c => `
    <div class="cert-card" onclick="openLightbox('${c.image}')">
      <div class="cert-image"><img src="${c.image}" alt="${c.title}" onerror="this.src='https://placehold.co/400x300/2A2522/888?text=Certificate'"></div>
      <div class="cert-info"><h4>${c.title}</h4><p>${c.issuer} • ${c.date}</p></div>
    </div>
  `).join('');
}

function renderContact() {
  const grid = document.getElementById('contactGrid');
  if (!grid) return;
  grid.innerHTML = contactData.map(c => `
    <a href="${c.link}" class="contact-card" target="_blank">
      <i class="${c.icon}"></i><h4>${c.title}</h4><p>${c.text}</p>
    </a>
  `).join('');
}

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  lb.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

renderProjects();
renderCertifications();
renderContact();

document.querySelector('.lightbox .close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) closeLightbox(); });

// Scroll to identity section when clicking scroll indicator
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
  document.querySelector('.identity')?.scrollIntoView({ behavior: 'smooth' });
});