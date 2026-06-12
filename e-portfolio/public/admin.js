let adminLoggedIn = false;
let currentPassword = 'admin123';
let currentEditId = null;

document.getElementById('adminFloatingBtn')?.addEventListener('click', () => {
  if (!adminLoggedIn) showLoginForm();
  else showAdminDashboard();
  document.getElementById('adminEditModal')?.classList.add('active');
});

document.querySelector('.close-modal')?.addEventListener('click', () => {
  document.getElementById('adminEditModal')?.classList.remove('active');
});

function showLoginForm() {
  document.getElementById('adminEditBody').innerHTML = `
    <div class="admin-login-form">
      <div class="login-icon"><i class="fas fa-lock"></i></div>
      <h4>Admin Access</h4>
      <input type="password" id="adminPassword" placeholder="Enter password">
      <button onclick="verifyPassword()">Login →</button>
      <p id="loginErrorMsg" class="error-msg"></p>
    </div>
  `;
}

window.verifyPassword = function() {
  if (document.getElementById('adminPassword').value === currentPassword) {
    adminLoggedIn = true;
    showAdminDashboard();
  } else {
    document.getElementById('loginErrorMsg').innerText = 'Wrong password!';
  }
};

function showAdminDashboard() {
  const body = document.getElementById('adminEditBody');
  body.innerHTML = `
    <div class="admin-dashboard-modal">
      <div class="dashboard-nav">
        <button class="dash-nav-btn active" data-dash="profile">Profile</button>
        <button class="dash-nav-btn" data-dash="projects">Projects</button>
        <button class="dash-nav-btn" data-dash="certificates">Certificates</button>
        <button class="dash-nav-btn" data-dash="academics">Academics</button>
        <button class="dash-nav-btn" data-dash="skills">Skills</button>
        <button class="dash-nav-btn" data-dash="milestones">Journey</button>
        <button class="dash-nav-btn" data-dash="social">Social</button>
        <button class="dash-nav-btn" data-dash="password">Security</button>
      </div>
      
      <div id="dashProfile" class="dash-panel active">
        <h4>Edit Profile</h4>
        <div class="form-group"><label>Bio</label><textarea id="dashBio" rows="4"></textarea></div>
        <div class="form-group"><label>Tags (comma separated)</label><input type="text" id="dashTags"></div>
        <div class="form-group"><label>Profile Photo</label><input type="file" id="dashPhoto" accept="image/*"></div>
        <button class="save-btn" onclick="saveProfile()">Save Profile</button>
      </div>
      
      <div id="dashProjects" class="dash-panel">
        <h4>Projects</h4>
        <div id="projectsList" class="items-list"></div>
        <button class="add-btn" onclick="showAddProject()">+ Add Project</button>
      </div>
      
      <div id="dashCertificates" class="dash-panel">
        <h4>Certificates</h4>
        <div id="certificatesList" class="items-list"></div>
        <button class="add-btn" onclick="showAddCertificate()">+ Add Certificate</button>
      </div>
      
      <div id="dashAcademics" class="dash-panel">
        <h4>Academic Tracker</h4>
        <div class="form-group"><label>Current CGPA</label><input type="text" id="dashCgpa"></div>
        <div class="form-group"><label>Current Semester</label><input type="text" id="dashSem"></div>
        <div class="form-group"><label>Credits Completed</label><input type="text" id="dashCredits"></div>
        <button class="save-btn" onclick="saveAcademics()">Save</button>
      </div>
      
      <div id="dashSkills" class="dash-panel">
        <h4>Skills</h4>
        <div class="form-group"><label>Programming (comma)</label><input type="text" id="dashProgramming"></div>
        <div class="form-group"><label>Learning (comma)</label><input type="text" id="dashLearning"></div>
        <button class="save-btn" onclick="saveSkills()">Save</button>
      </div>
      
      <div id="dashMilestones" class="dash-panel">
        <h4>Engineering Journey Milestones</h4>
        <p style="font-size:0.7rem; color:#888; margin-bottom:1rem;">Order determines display sequence (lower numbers appear first)</p>
        <div id="milestonesList" class="items-list"></div>
        <button class="add-btn" onclick="showAddMilestone()">+ Add Milestone</button>
      </div>
      
      <div id="dashSocial" class="dash-panel">
        <h4>Social Links</h4>
        <div id="socialList" class="items-list"></div>
        <button class="add-btn" onclick="showAddSocial()">+ Add Social</button>
      </div>
      
      <div id="dashPassword" class="dash-panel">
        <h4>Change Password</h4>
        <div class="form-group"><label>Current</label><input type="password" id="currentPass"></div>
        <div class="form-group"><label>New</label><input type="password" id="newPass"></div>
        <div class="form-group"><label>Confirm</label><input type="password" id="confirmPass"></div>
        <button class="save-btn" onclick="changePassword()">Change</button>
      </div>
    </div>
  `;
  
  loadProfileData();
  loadProjects();
  loadCertificates();
  loadAcademics();
  loadSkills();
  loadMilestones();
  loadSocial();
  
  document.querySelectorAll('.dash-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dash-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`dash${btn.dataset.dash.charAt(0).toUpperCase() + btn.dataset.dash.slice(1)}`).classList.add('active');
    });
  });
}

async function loadProfileData() {
  const res = await fetch('/api/profile'); const data = await res.json();
  document.getElementById('dashBio').value = data.bio || '';
  document.getElementById('dashTags').value = (data.tags || []).join(', ');
}

window.saveProfile = async function() {
  const bio = document.getElementById('dashBio').value;
  const tags = document.getElementById('dashTags').value.split(',').map(t => t.trim());
  await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bio, tags }) });
  const photo = document.getElementById('dashPhoto').files[0];
  if (photo) { const fd = new FormData(); fd.append('profile', photo); const res = await fetch('/api/upload/profile', { method: 'POST', body: fd }); const { url } = await res.json(); await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ photo: url }) }); }
  alert('Saved!'); location.reload();
};

async function loadProjects() {
  const res = await fetch('/api/projects'); const items = await res.json();
  const container = document.getElementById('projectsList');
  if (!items.length) { container.innerHTML = '<div class="empty-list">No projects</div>'; return; }
  container.innerHTML = items.map(p => `<div class="item"><div><strong>${escapeHtml(p.title)}</strong><br>${escapeHtml(p.description?.substring(0,50))}</div><div><button onclick="editProject('${p.id}')">Edit</button><button onclick="deleteProject('${p.id}')">Del</button></div></div>`).join('');
}

window.showAddProject = () => showItemModal('project', null);
window.editProject = async (id) => { const res=await fetch('/api/projects'); const items=await res.json(); showItemModal('project', items.find(i=>i.id===id)); };
window.deleteProject = async (id) => { if(confirm('Delete?')){ await fetch(`/api/projects/${id}`,{method:'DELETE'}); location.reload(); } };

async function loadCertificates() {
  const res = await fetch('/api/certificates'); const items = await res.json();
  const container = document.getElementById('certificatesList');
  if (!items.length) { container.innerHTML = '<div class="empty-list">No certificates</div>'; return; }
  container.innerHTML = items.map(c => `<div class="item"><div><strong>${escapeHtml(c.title)}</strong><br>${c.issuer}</div><div><button onclick="editCertificate('${c.id}')">Edit</button><button onclick="deleteCertificate('${c.id}')">Del</button></div></div>`).join('');
}

window.showAddCertificate = () => showItemModal('certificate', null);
window.editCertificate = async (id) => { const res=await fetch('/api/certificates'); const items=await res.json(); showItemModal('certificate', items.find(i=>i.id===id)); };
window.deleteCertificate = async (id) => { if(confirm('Delete?')){ await fetch(`/api/certificates/${id}`,{method:'DELETE'}); location.reload(); } };

// ============ MILESTONES CRUD ============
async function loadMilestones() {
  const res = await fetch('/api/milestones'); const items = await res.json();
  const container = document.getElementById('milestonesList');
  if (!items.length) { container.innerHTML = '<div class="empty-list">No milestones. Add your engineering journey.</div>'; return; }
  container.innerHTML = items.sort((a,b)=>a.order-b.order).map(m => `
    <div class="item">
      <div><strong>[${m.order}] ${escapeHtml(m.year)}: ${escapeHtml(m.title)}</strong><br>${escapeHtml(m.description?.substring(0,60))}<br><small>Category: ${m.category} | Status: ${m.status}</small></div>
      <div><button onclick="editMilestone('${m.id}')">Edit</button><button onclick="deleteMilestone('${m.id}')">Del</button></div>
    </div>
  `).join('');
}

window.showAddMilestone = () => showItemModal('milestone', null);
window.editMilestone = async (id) => { const res=await fetch('/api/milestones'); const items=await res.json(); showItemModal('milestone', items.find(i=>i.id===id)); };
window.deleteMilestone = async (id) => { if(confirm('Delete this milestone?')){ await fetch(`/api/milestones/${id}`,{method:'DELETE'}); location.reload(); } };

async function loadAcademics() {
  const res = await fetch('/api/education'); const data = await res.json();
  document.getElementById('dashCgpa').value = data.currentCgpa || '';
  document.getElementById('dashSem').value = data.currentSemester || '';
  document.getElementById('dashCredits').value = data.creditsCompleted || '';
}
window.saveAcademics = async () => {
  await fetch('/api/education',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({ currentCgpa:document.getElementById('dashCgpa').value, currentSemester:document.getElementById('dashSem').value, creditsCompleted:document.getElementById('dashCredits').value })});
  alert('Saved!'); location.reload();
};

async function loadSkills() {
  const res = await fetch('/api/skills'); const data = await res.json();
  document.getElementById('dashProgramming').value = (data.programming || []).join(', ');
  document.getElementById('dashLearning').value = (data.learning || []).join(', ');
}
window.saveSkills = async () => {
  await fetch('/api/skills',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({ programming:document.getElementById('dashProgramming').value.split(',').map(s=>s.trim()), learning:document.getElementById('dashLearning').value.split(',').map(s=>s.trim()) })});
  alert('Saved!'); location.reload();
};

async function loadSocial() {
  const res = await fetch('/api/socials'); const items = await res.json();
  const container = document.getElementById('socialList');
  if (!items.length) { container.innerHTML = '<div class="empty-list">No social links</div>'; return; }
  container.innerHTML = items.map(s => `<div class="item"><div><strong>${escapeHtml(s.platform)}</strong><br>${escapeHtml(s.url)}</div><div><button onclick="editSocial('${s.id}')">Edit</button><button onclick="deleteSocial('${s.id}')">Del</button></div></div>`).join('');
}
window.showAddSocial = () => showItemModal('social', null);
window.editSocial = async (id) => { const res=await fetch('/api/socials'); const items=await res.json(); showItemModal('social', items.find(i=>i.id===id)); };
window.deleteSocial = async (id) => { if(confirm('Delete?')){ await fetch(`/api/socials/${id}`,{method:'DELETE'}); location.reload(); } };

// ============ MODAL FORMS ============
function showItemModal(type, item) {
  let html = '';
  if (type === 'project') {
    html = `<h3>${item?'Edit':'Add'} Project</h3>
      <div class="form-group"><label>Title</label><input id="f_title" value="${escapeHtml(item?.title||'')}"></div>
      <div class="form-group"><label>Description</label><textarea id="f_desc">${escapeHtml(item?.description||'')}</textarea></div>
      <div class="form-group"><label>Technologies (comma)</label><input id="f_tech" value="${item?.tech?.join(',')||''}"></div>
      <div class="form-group"><label>GitHub URL</label><input id="f_github" value="${escapeHtml(item?.github||'')}"></div>
      <div class="form-group"><label>Demo URL</label><input id="f_demo" value="${escapeHtml(item?.demo||'')}"></div>
      <div class="form-group"><label>Project Image</label><input type="file" id="f_image" accept="image/*"></div>
      <div class="modal-actions"><button onclick="closeModal()">Cancel</button><button class="save-btn" onclick="saveItem('projects', '${item?.id||''}', 'project')">Save</button></div>`;
  }
  if (type === 'certificate') {
    html = `<h3>${item?'Edit':'Add'} Certificate</h3>
      <div class="form-group"><label>Title</label><input id="f_title" value="${escapeHtml(item?.title||'')}"></div>
      <div class="form-group"><label>Issuer</label><input id="f_issuer" value="${escapeHtml(item?.issuer||'')}"></div>
      <div class="form-group"><label>Date</label><input id="f_date" value="${escapeHtml(item?.date||'')}"></div>
      <div class="form-group"><label>Certificate Image</label><input type="file" id="f_image" accept="image/*"></div>
      <div class="modal-actions"><button onclick="closeModal()">Cancel</button><button class="save-btn" onclick="saveItem('certificates', '${item?.id||''}', 'certificate')">Save</button></div>`;
  }
  if (type === 'milestone') {
    html = `<h3>${item?'Edit':'Add'} Milestone</h3>
      <div class="form-group"><label>Year</label><input id="f_year" value="${escapeHtml(item?.year||'')}"></div>
      <div class="form-group"><label>Title</label><input id="f_title" value="${escapeHtml(item?.title||'')}"></div>
      <div class="form-group"><label>Description</label><textarea id="f_desc">${escapeHtml(item?.description||'')}</textarea></div>
      <div class="form-group"><label>Category</label>
        <select id="f_category"><option ${item?.category==='Education'?'selected':''}>Education</option><option ${item?.category==='Engineering'?'selected':''}>Engineering</option><option ${item?.category==='Learning'?'selected':''}>Learning</option><option ${item?.category==='Project'?'selected':''}>Project</option><option ${item?.category==='Hackathon'?'selected':''}>Hackathon</option><option ${item?.category==='Internship'?'selected':''}>Internship</option><option ${item?.category==='Creativity'?'selected':''}>Creativity</option><option ${item?.category==='Startup'?'selected':''}>Startup</option></select>
      </div>
      <div class="form-group"><label>Status</label>
        <select id="f_status"><option ${item?.status==='completed'?'selected':''}>completed</option><option ${item?.status==='in-progress'?'selected':''}>in-progress</option><option ${item?.status==='planned'?'selected':''}>planned</option><option ${item?.status==='ongoing'?'selected':''}>ongoing</option></select>
      </div>
      <div class="form-group"><label>Icon (Font Awesome class)</label><input id="f_icon" value="${escapeHtml(item?.icon||'fas fa-star')}"></div>
      <div class="form-group"><label>Order (lower number appears first)</label><input type="number" id="f_order" value="${item?.order||0}"></div>
      <div class="form-group"><label>Image (optional)</label><input type="file" id="f_image" accept="image/*"></div>
      <div class="modal-actions"><button onclick="closeModal()">Cancel</button><button class="save-btn" onclick="saveItem('milestones', '${item?.id||''}', 'milestone')">Save</button></div>`;
  }
  if (type === 'social') {
    html = `<h3>${item?'Edit':'Add'} Social Link</h3>
      <div class="form-group"><label>Platform</label><input id="f_platform" value="${escapeHtml(item?.platform||'')}"></div>
      <div class="form-group"><label>URL</label><input id="f_url" value="${escapeHtml(item?.url||'')}"></div>
      <div class="modal-actions"><button onclick="closeModal()">Cancel</button><button class="save-btn" onclick="saveItem('socials', '${item?.id||''}', 'social')">Save</button></div>`;
  }
  const modal = document.getElementById('modal'); document.getElementById('modalBody').innerHTML = html; modal.classList.add('active');
  window.currentType = type; window.currentId = item?.id || null;
}

window.saveItem = async (endpoint, id, type) => {
  const data = {};
  if (document.getElementById('f_title')) data.title = document.getElementById('f_title').value;
  if (document.getElementById('f_desc')) data.description = document.getElementById('f_desc').value;
  if (document.getElementById('f_tech')) data.tech = document.getElementById('f_tech').value.split(',').map(t=>t.trim());
  if (document.getElementById('f_github')) data.github = document.getElementById('f_github').value;
  if (document.getElementById('f_demo')) data.demo = document.getElementById('f_demo').value;
  if (document.getElementById('f_issuer')) data.issuer = document.getElementById('f_issuer').value;
  if (document.getElementById('f_date')) data.date = document.getElementById('f_date').value;
  if (document.getElementById('f_year')) data.year = document.getElementById('f_year').value;
  if (document.getElementById('f_category')) data.category = document.getElementById('f_category').value;
  if (document.getElementById('f_status')) data.status = document.getElementById('f_status').value;
  if (document.getElementById('f_icon')) data.icon = document.getElementById('f_icon').value;
  if (document.getElementById('f_order')) data.order = parseInt(document.getElementById('f_order').value);
  if (document.getElementById('f_platform')) data.platform = document.getElementById('f_platform').value;
  if (document.getElementById('f_url')) data.url = document.getElementById('f_url').value;
  
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/${endpoint}/${id}` : `/api/${endpoint}`;
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  
  const image = document.getElementById('f_image')?.files[0];
  if (image) {
    const fd = new FormData();
    fd.append(type === 'milestone' ? 'milestone' : type === 'project' ? 'project' : type === 'certificate' ? 'certificate' : type, image);
    await fetch(`/api/upload/${type === 'milestone' ? 'milestone' : type === 'project' ? 'project' : type === 'certificate' ? 'certificate' : 'profile'}`, { method: 'POST', body: fd });
  }
  
  closeModal(); location.reload();
};

window.changePassword = function() {
  const current = document.getElementById('currentPass').value;
  const newPass = document.getElementById('newPass').value;
  const confirm = document.getElementById('confirmPass').value;
  if (current !== currentPassword) { alert('Current password incorrect!'); return; }
  if (newPass !== confirm) { alert('Passwords do not match!'); return; }
  if (newPass.length < 4) { alert('Password too short!'); return; }
  currentPassword = newPass;
  alert('Password changed!');
};

function closeModal() { document.getElementById('modal')?.classList.remove('active'); }
function escapeHtml(str) { if(!str) return ''; return String(str).replace(/[&<>]/g, m => m==='&'?'&amp;':m==='<'?'&lt;':m==='>'?'&gt;':m); }