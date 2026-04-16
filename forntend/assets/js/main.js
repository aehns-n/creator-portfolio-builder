// 🔥 BASE URL
const BASE_URL = "https://creator-portfolio-builder.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

// ===== CONTACT FORM =====
const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");

if (form) {
form.addEventListener("submit", async function (e) {
e.preventDefault();

const name = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");

let isValid = true;

if (!name?.value.trim()) isValid = false;
if (!email?.value.includes("@")) isValid = false;
if (message?.value.trim().length < 10) isValid = false;

if (!isValid) return;

if(statusText){
statusText.textContent="Sending...";
statusText.style.color="blue";
}

try{
const res=await fetch(`${BASE_URL}/contact`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
name:name.value,
email:email.value,
message:message.value
})
});

const data=await res.json();

if(statusText){
statusText.textContent=data.message || "Sent successfully!";
statusText.style.color="green";
}

form.reset();

}catch{
if(statusText){
statusText.textContent="Error sending";
statusText.style.color="red";
}
}
});
}


// ===== BUILDER =====
const builderForm=document.getElementById("builder-form");
const builderName=document.getElementById("builder-name");
const builderTitle=document.getElementById("builder-title");

const heroName=document.getElementById("creator-name");
const heroTitle=document.getElementById("creator-title");

builderName?.addEventListener("input",()=>{
heroName.textContent=builderName.value || "Creator";
});

builderTitle?.addEventListener("input",()=>{
heroTitle.textContent=builderTitle.value || "Web Developer";
});


// ===== SKILLS =====
let skillsList=[];
document.getElementById("add-skill-btn")?.addEventListener("click",()=>{
const val=document.getElementById("skill-input").value.trim();
if(!val || skillsList.includes(val)) return;

skillsList.push(val);

const chip=document.createElement("span");
chip.className = "skill-chip";
chip.innerHTML = `${val} <span class="delete-chip" data-skill="${val}">×</span>`;
chip.querySelector('.delete-chip').onclick = () => {
  skillsList = skillsList.filter(s => s !== val);
  chip.remove();
  updateAboutSkills();
};
document.getElementById("skills-preview").appendChild(chip);

document.getElementById("skill-input").value="";
});

function updateAboutSkills(isPreview = true) {
  const aboutSkills = document.getElementById("about-skills");
  aboutSkills.innerHTML = "";
  skillsList.forEach(skill => {
    const chip = document.createElement("span");
    chip.className = "skill-chip";
    if (isPreview) {
      chip.innerHTML = `${skill} <span class="delete-chip">×</span>`;
      chip.querySelector('.delete-chip').onclick = () => {
        skillsList = skillsList.filter(s => s !== skill);
        chip.remove();
        updateAboutSkills(isPreview);
      };
    } else {
      chip.textContent = skill;
    }
    aboutSkills.appendChild(chip);
  });
}


// ===== PROJECTS =====
let projectList=[];
document.getElementById("add-project-btn")?.addEventListener("click",()=>{
const title=document.getElementById("project-title").value.trim();
const desc=document.getElementById("project-desc").value.trim();
const image = document.getElementById("project-image").value.trim();

if(!title || !desc) return;

const projectIndex = projectList.push({title,desc,image}) - 1;

const card=document.createElement("div");
card.className = "project-preview-card";
card.innerHTML = `
  <img src="${image || 'https://picsum.photos/300/200?random=' + Math.random()}" alt="${title}" style="width:100%;border-radius:8px;">
  <h3>${title}</h3>
  <p>${desc}</p>
  <button class="delete-chip" data-project="${projectIndex}">×</button>
`;
card.querySelector('.delete-chip').onclick = () => {
  projectList.splice(projectIndex, 1);
  card.remove();
  updateProjectsGrid();
};
document.getElementById("project-preview").appendChild(card);

document.getElementById("project-title").value = "";
document.getElementById("project-desc").value = "";
document.getElementById("project-image").value = "";
});

function updateProjectsGrid() {
  const projectsGrid = document.getElementById("projects-grid");
  projectsGrid.innerHTML = "";
  projectList.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <img src="${p.image || 'https://picsum.photos/400/250?random=' + i}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
    `;
    projectsGrid.appendChild(card);
  });
}


// ===== BUILDER SUBMIT =====
builderForm?.addEventListener("submit", async (e)=>{
e.preventDefault();

const generateBtn = e.target.querySelector('.generate-btn');
generateBtn.classList.add('loading');
generateBtn.textContent = 'Generating...';

const nameInput = builderName.value.trim();
const titleInput = builderTitle.value.trim();

heroName.textContent = nameInput || 'Creator';
heroTitle.textContent = titleInput || 'Web Developer';

updateAboutSkills(true);
updateProjectsGrid();
updateProfileImage(); // Call if uploaded

// show download - ensure visible
const downloadBtn = document.getElementById("download-btn");
downloadBtn.style.setProperty('display', 'block', 'important');
downloadBtn.classList.add("cta-btn");

// scroll to projects to see download button
document.getElementById("projects")?.scrollIntoView({behavior:"smooth"});

// save backend
try {
  const token = localStorage.getItem("token");
  await fetch(`${BASE_URL}/save-portfolio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      name: nameInput,
      title: titleInput,
      skills: skillsList,
      projects: projectList
    })
  });
} catch (err) {
  console.error('Save failed:', err);
} finally {

}
});
});


// ===== TEMPLATE SWITCH =====
const templateCards=document.querySelectorAll(".template-card");
const portfolioContainer=document.getElementById("portfolio-container");

templateCards.forEach(card=>{
card.addEventListener("click",()=>{
templateCards.forEach(c=>c.classList.remove("active"));
card.classList.add("active");

portfolioContainer.className="portfolio "+card.dataset.template;
});
});


// ===== DOWNLOAD (FIXED - SCOPE SAFE - MOVED INSIDE DOMCONTENTLOADED) =====
const downloadBtn = document.getElementById("download-btn");

if (downloadBtn) {
  downloadBtn.addEventListener("click", function() {
    const nameEl = document.getElementById("creator-name");
    const titleEl = document.getElementById("creator-title");
    const profileImg = document.getElementById("hero-profile-img");
    const aboutSkills = document.getElementById("about-skills");

  const projectsGrid = document.getElementById("projects-grid");
  
  if (!aboutSkills || !projectsGrid) return console.error("DOM elements missing");
  
  const name = nameEl?.textContent.trim() || 'Creator';
  const title = titleEl?.textContent.trim() || 'Web Developer';
  const profileSrc = profileImg?.src || '';
  
  // Clean portfolio skills (no delete ×)
  if (typeof updateAboutSkills === "function") {
    updateAboutSkills(false);
  }
  const skillsHTML = aboutSkills.innerHTML;
  // Restore preview
  if (typeof updateAboutSkills === "function") {
    updateAboutSkills(true);
  }
  
  const projectsHTML = projectsGrid.innerHTML;

const modernCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg-primary: #0a0e1a;
  --bg-secondary: #0f172a;
  --glass-bg: rgba(15, 23, 42, 0.8);
  --glass-border: rgba(71, 85, 105, 0.5);
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --accent: #3b82f6;
  --accent-glow: rgba(59, 130, 246, 0.5);
  --gradient: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.7;
  overflow-x: hidden;
}

.container {
  max-width: 1150px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ===== SECTIONS ===== */
.section {
  padding: 6rem 0;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.section.visible {
  opacity: 1;
  transform: translateY(0);
}

h2 {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;
}

/* ===== HERO - SIDE-BY-SIDE ===== */
.hero {
  padding: 8rem 0;
  display: flex;
  align-items: center;
  gap: 4rem;
  background: linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 50%);
}

.hero-content {
  flex: 1;
}

.hero h1 {
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.375rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  max-width: 500px;
  font-weight: 400;
}

.hero-image {
  flex-shrink: 0;
}

.profile-img {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--glass-border);
  box-shadow: var(--shadow), 0 0 0 8px rgba(59,130,246,0.1);
  transition: all 0.4s ease;
}

.profile-img:hover {
  transform: scale(1.05) translateY(-10px);
  box-shadow: var(--shadow), 0 0 40px var(--accent-glow);
}

/* ===== SKILLS ===== */
.skills-section {
  text-align: center;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.skill-chip {
  background: rgba(71,85,105,0.4);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  padding: 0.875rem 1.75rem;
  border-radius: 50px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.skill-chip:hover {
  background: var(--accent-glow);
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(59,130,246,0.3);
}

/* ===== PROJECTS ===== */
.projects-section {
  text-align: center;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
}

.project-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient);
}

.project-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 1.75rem;
  transition: transform 0.4s ease;
}

.project-card:hover img {
  transform: scale(1.05);
}

.project-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.project-card p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.project-card:hover {
  transform: translateY(-16px);
  border-color: var(--accent);
  box-shadow: var(--shadow);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    gap: 2.5rem;
    padding: 4rem 1rem;
  }
  
  .profile-img {
    width: 240px;
    height: 240px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .skills {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .project-card {
    padding: 2rem 1.5rem;
  }
}

/* ===== OBSERVER JS (IMPROVED) ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = \`\${index * 0.1}s\`;
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach(sectionObserver.observe);
`;

  const observerJS = 'const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }; const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); } }); }, observerOptions); document.querySelectorAll(".section").forEach(el => observer.observe(el));';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Portfolio</title>
  <meta name="description" content="${title} - Professional portfolio showcasing web development projects and skills.">
  <style>${modernCSS}</style>
</head>
<body>
  <div class="container">
    <!-- HERO - FLEX LAYOUT -->
    <section class="hero section">
      <div class="hero-content">
        <h1>${name}</h1>
        <p class="hero-subtitle">${title}</p>
      </div>
      <div class="hero-image">
        <img src="${profileSrc}" alt="${name}" class="profile-img" style="opacity:0;animation:fadeInUp 1s ease 0.5s forwards">
      </div>
    </section>
    
    <!-- SKILLS -->
    <section class="skills-section section">
      <h2>Skills</h2>
      <div class="skills">${skillsHTML}</div>
    </section>
    
    <!-- PROJECTS -->
    <section class="projects-section section">
      <h2>Featured Projects</h2>
      <div class="projects-grid">${projectsHTML}</div>
    </section>
    
    <!-- FOOTER -->
    <footer style="text-align: center; padding: 3rem 0; color: var(--text-secondary); font-size: 0.9rem; border-top: 1px solid var(--glass-border);">
      <p>&copy; ${new Date().getFullYear()} ${name}. Built with ❤️</p>
    </footer>
  </div>
  <script>${observerJS}</script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name.replace(/\\s+/g, "_") + "_portfolio.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
URL.revokeObjectURL(url);
    });
  }

// ===== LOGIN =====
// Remove fallback login form handler - use dedicated login.html
// const loginForm = ... (commented out)


// ===== AUTH UTILS & INIT =====
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function initAuth() {
  const loginLink = document.querySelector('#nav-links a[href="#login"]');
  if (isAuthenticated()) {
    document.getElementById('logoutBtn').style.display = 'inline-block';
    loginLink.style.display = 'none';
    loadPortfolio().catch(console.error);
  } else {
    document.getElementById('logoutBtn').style.display = 'none';
    loginLink.style.display = 'inline-block';
    loginLink.href = 'login.html';
  }
}

// ===== LOAD =====
async function loadPortfolio() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${BASE_URL}/my-portfolio`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    const nameEl = document.getElementById('creator-name');
    if (nameEl) nameEl.textContent = data.name || 'Creator';
  } catch (err) {
    console.error('Load portfolio failed:', err);
  }
}

// ===== LOGOUT HANDLER =====
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  document.body.style.opacity = '0';
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 300);
});

// ===== PROFILE UPLOAD =====
document.getElementById('profile-upload')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById('hero-profile-img').src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function updateProfileImage() {
  const livePreview = document.getElementById('live-profile-preview');
  if (livePreview && livePreview.src && livePreview.style.display !== 'none') {
    const heroImg = document.getElementById('hero-profile-img');
    if (heroImg) heroImg.src = livePreview.src;
  }
}

// ===== STAGGER ANIMATIONS (CONSOLIDATED) =====
(function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  const staggerEls = document.querySelectorAll('[data-stagger]');
  if (staggerEls.length > 0) {
    staggerEls.forEach(el => observer.observe(el));
  }
})();

// Init auth
initAuth();
