// 🔥 BASE URL
const BASE_URL = "https://creator-portfolio-builder.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  // ===== ALL CODE INSIDE DOMCONTENTLOADED - FIXED SCOPE =====

  // ===== UTILITY FUNCTIONS - MOVED UP FOR ACCESSIBILITY =====
  function updateAboutSkills(isPreview = true) {
    const aboutSkills = document.getElementById("about-skills");
    if (!aboutSkills) return;
    
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

  function updateProjectsGrid() {
    const projectsGrid = document.getElementById("projects-grid");
    if (!projectsGrid) return;
    
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

  function updateProfileImage() {
    const livePreview = document.getElementById('live-profile-preview');
    if (livePreview && livePreview.src && livePreview.style.display !== 'none') {
      const heroImg = document.getElementById('hero-profile-img');
      if (heroImg) heroImg.src = livePreview.src;
    }
  }

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

      if (statusText) {
        statusText.textContent = "Sending...";
        statusText.style.color = "blue";
      }

      try {
        const res = await fetch(`${BASE_URL}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            message: message.value
          })
        });

        const data = await res.json();
        if (statusText) {
          statusText.textContent = data.message || "Sent successfully!";
          statusText.style.color = "green";
        }
        form.reset();
      } catch {
        if (statusText) {
          statusText.textContent = "Error sending";
          statusText.style.color = "red";
        }
      }
    });
  }

  // ===== BUILDER SYNC =====
  const builderName = document.getElementById("builder-name");
  const builderTitle = document.getElementById("builder-title");
  const heroName = document.getElementById("creator-name");
  const heroTitle = document.getElementById("creator-title");

  if (builderName) {
    builderName.addEventListener("input", () => {
      if (heroName) heroName.textContent = builderName.value || "Creator";
    });
  }

  if (builderTitle) {
    builderTitle.addEventListener("input", () => {
      if (heroTitle) heroTitle.textContent = builderTitle.value || "Web Developer";
    });
  }

  // ===== SKILLS - FIXED =====
  let skillsList = [];
  const addSkillBtn = document.getElementById("add-skill-btn");
  if (addSkillBtn) {
    addSkillBtn.addEventListener("click", () => {
      const skillInput = document.getElementById("skill-input");
      if (!skillInput) return;
      
      const val = skillInput.value.trim();
      if (!val || skillsList.includes(val)) return;

      skillsList.push(val);
      const chip = document.createElement("span");
      chip.className = "skill-chip";
      chip.innerHTML = `${val} <span class="delete-chip" data-skill="${val}">×</span>`;
      
      const deleteChip = chip.querySelector('.delete-chip');
      if (deleteChip) {
        deleteChip.onclick = () => {
          skillsList = skillsList.filter(s => s !== val);
          chip.remove();
          updateAboutSkills();
        };
      }
      
      const skillsPreview = document.getElementById("skills-preview");
      if (skillsPreview) skillsPreview.appendChild(chip);
      
      skillInput.value = "";
      updateAboutSkills();
    });
  }

  // ===== PROJECTS - FIXED =====
  let projectList = [];
  const addProjectBtn = document.getElementById("add-project-btn");
  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", () => {
      const titleInput = document.getElementById("project-title");
      const descInput = document.getElementById("project-desc");
      const imageInput = document.getElementById("project-image");
      
      if (!titleInput || !descInput) return;
      
      const title = titleInput.value.trim();
      const desc = descInput.value.trim();
      const image = imageInput ? imageInput.value.trim() : '';

      if (!title || !desc) return;

      const projectIndex = projectList.push({ title, desc, image }) - 1;

      const card = document.createElement("div");
      card.className = "project-preview-card";
      card.innerHTML = `
        <img src="${image || 'https://picsum.photos/300/200?random=' + Math.random()}" alt="${title}" style="width:100%;border-radius:8px;">
        <h3>${title}</h3>
        <p>${desc}</p>
        <button class="delete-chip" data-project="${projectIndex}">×</button>
      `;
      
      const deleteBtn = card.querySelector('.delete-chip');
      if (deleteBtn) {
        deleteBtn.onclick = () => {
          projectList.splice(projectIndex, 1);
          card.remove();
          updateProjectsGrid();
        };
      }
      
      const projectPreview = document.getElementById("project-preview");
      if (projectPreview) projectPreview.appendChild(card);

      if (titleInput) titleInput.value = "";
      if (descInput) descInput.value = "";
      if (imageInput) imageInput.value = "";
      updateProjectsGrid();
    });
  }

  // ===== BUILDER SUBMIT - FIXED CLOSING =====
  const builderForm = document.getElementById("builder-form");
  if (builderForm) {
    builderForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const generateBtn = e.target.querySelector('.generate-btn');
      if (generateBtn) {
        generateBtn.classList.add('loading');
        generateBtn.textContent = 'Generating...';
      }

      const nameInput = builderName ? builderName.value.trim() : '';
      const titleInput = builderTitle ? builderTitle.value.trim() : '';

      if (heroName) heroName.textContent = nameInput || 'Creator';
      if (heroTitle) heroTitle.textContent = titleInput || 'Web Developer';

      updateAboutSkills(true);
      updateProjectsGrid();
      updateProfileImage();

      // Show download button
      const downloadBtn = document.getElementById("download-btn");
      if (downloadBtn) {
        downloadBtn.style.setProperty('display', 'block', 'important');
        downloadBtn.classList.add("cta-btn");
      }

      // Scroll to projects
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }

      // Save to backend
      try {
        const token = localStorage.getItem("token");
        if (token) {
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
        }
      } catch (err) {
        console.error('Save failed:', err);
      } finally {
        if (generateBtn) {
          generateBtn.classList.remove('loading');
          generateBtn.textContent = 'Generate Portfolio';
        }
      }
    }); // ← FIXED: Added missing closing
  }

  // ===== TEMPLATE SWITCH =====
  const templateCards = document.querySelectorAll(".template-card");
  const portfolioContainer = document.getElementById("portfolio-container");
  templateCards.forEach(card => {
    card.addEventListener("click", () => {
      templateCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      if (portfolioContainer) {
        portfolioContainer.className = "portfolio " + card.dataset.template;
      }
    });
  });

  // ===== DOWNLOAD - CONSOLIDATED SINGLE LISTENER WITH TRY-CATCH =====
  const downloadBtn = document.getElementById("download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function() {
      try {
        const nameEl = document.getElementById("creator-name");
        const titleEl = document.getElementById("creator-title");
        const profileImg = document.getElementById("hero-profile-img");
        const aboutSkills = document.getElementById("about-skills");
        const projectsGrid = document.getElementById("projects-grid");

        if (!aboutSkills || !projectsGrid) {
          console.error("DOM elements missing");
          return;
        }

        const name = nameEl?.textContent?.trim() || 'Creator';
        const title = titleEl?.textContent?.trim() || 'Web Developer';
        const profileSrc = profileImg?.src || 'https://via.placeholder.com/300x300/6366f1/ffffff?text=%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB';

        // Clean skills HTML for export (remove delete buttons)
        updateAboutSkills(false);
        const skillsHTML = aboutSkills.innerHTML;
        updateAboutSkills(true); // Restore preview

        const projectsHTML = projectsGrid.innerHTML;

        // Template detection
        const selectedTemplate = document.querySelector('.template-card.active')?.dataset.template || 'modern';

        // FIXED: Properly escaped CSS template literals
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
        `;

        const minimalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; background: #ffffff; }
.container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }
.section { padding: 5rem 0; }
h1, h2 { font-weight: 500; line-height: 1.2; }
h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; }
h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 3rem; text-align: center; }
.hero { padding: 6rem 0; display: flex; align-items: center; gap: 3rem; border-bottom: 1px solid #e5e5e5; padding-bottom: 4rem; margin-bottom: 4rem; }
.hero-content { flex: 1; }
.hero-subtitle { font-size: 1.25rem; color: #666; margin-bottom: 2rem; max-width: 450px; }
.hero-image { flex-shrink: 0; }
.profile-img { width: 260px; height: 260px; border-radius: 12px; object-fit: cover; border: 1px solid #e5e5e5; transition: box-shadow 0.2s; }
.profile-img:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.skills-section, .projects-section { text-align: center; }
.skills { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; max-width: 700px; margin: 0 auto; }
.skill-chip { background: #f8f9fa; border: 1px solid #e5e5e5; padding: 0.75rem 1.5rem; border-radius: 25px; font-weight: 500; font-size: 0.9rem; transition: all 0.2s; }
.skill-chip:hover { background: #f0f0f0; transform: translateY(-1px); }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-top: 2rem; }
.project-card { border: 1px solid #e5e5e5; border-radius: 12px; padding: 2rem; transition: all 0.2s; }
.project-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem; }
.project-card h3 { font-size: 1.3rem; font-weight: 600; margin-bottom: 0.75rem; color: #1a1a1a; }
.project-card p { color: #666; line-height: 1.6; }
.project-card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.1); transform: translateY(-4px); }
@media (max-width: 768px) { .hero { flex-direction: column; text-align: center; gap: 2rem; } .profile-img { width: 220px; height: 220px; } .projects-grid { grid-template-columns: 1fr; } }
        `;

        const creativeCSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
:root { --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%); --card-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); --text-primary: #fff; --text-secondary: rgba(255,255,255,0.9); --shadow-lg: 0 20px 60px rgba(0,0,0,0.3); --shadow-glow: 0 0 30px rgba(255,255,255,0.2); }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Poppins', sans-serif; background: var(--bg-gradient); color: var(--text-primary); line-height: 1.7; min-height: 100vh; overflow-x: hidden; }
body::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,119,198,0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120,219,255,0.3) 0%, transparent 50%); pointer-events: none; z-index: -1; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }
.section { padding: 6rem 0; opacity: 0; transform: translateY(40px); animation: slideInUp 0.8s ease forwards; }
@keyframes slideInUp { to { opacity: 1; transform: translateY(0); } }
h2 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; text-align: center; margin-bottom: 4rem; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero { padding: 8rem 0 6rem; text-align: center; position: relative; }
.hero h1 { font-size: clamp(3.5rem, 8vw, 6rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { font-size: 1.5rem; color: var(--text-secondary); margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto; font-weight: 300; }
.profile-img { width: 300px; height: 300px; border-radius: 50%; object-fit: cover; border: 8px solid rgba(255,255,255,0.2); box-shadow: var(--shadow-lg), var(--shadow-glow); transition: all 0.4s cubic-bezier(.175,.885,.32,1.275); animation: float 6s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
.skill-chip { background: var(--card-gradient); padding: 1rem 2rem; border-radius: 50px; font-weight: 600; font-size: 1rem; box-shadow: var(--shadow-lg); transition: all .4s; }
.skill-chip:hover { transform: translateY(-10px) scale(1.05); box-shadow: 0 30px 60px rgba(0,0,0,.4); }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2.5rem; margin-top: 3rem; }
.project-card { background: rgba(255,255,255,.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,.2); border-radius: 24px; padding: 2.5rem; transition: all .4s cubic-bezier(.175,.885,.32,1.275); }
.project-card:hover { transform: translateY(-20px) scale(1.02); box-shadow: var(--shadow-lg); }
@media (max-width: 768px) { .profile-img { width: 260px; height: 260px; } .projects-grid { grid-template-columns: 1fr; } }
        `;

        // FIXED: Properly escaped observerJS
        const observerJS = `
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);
document.querySelectorAll(".section").forEach(el => observer.observe(el));
        `;

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Portfolio</title>
  <meta name="description" content="${title} - Professional portfolio showcasing web development projects and skills.">
  <style>${selectedTemplate === 'minimal' ? minimalCSS : selectedTemplate === 'creative' ? creativeCSS : modernCSS}</style>
</head>
<body>
  <div class="container">
    <section class="hero section">
      <div class="hero-content">
        <h1>${name}</h1>
        <p class="hero-subtitle">${title}</p>
      </div>
      <div class="hero-image">
        <img src="${profileSrc}" alt="${name}" class="profile-img">
      </div>
    </section>
    
    <section class="skills-section section">
      <h2>Skills</h2>
      <div class="skills">${skillsHTML}</div>
    </section>
    
    <section class="projects-section section">
      <h2>Featured Projects</h2>
      <div class="projects-grid">${projectsHTML}</div>
    </section>
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
        
        console.log("Portfolio downloaded successfully!");
      } catch (error) {
        console.error("Download failed:", error);
      }
    });
  }

  // ===== AUTH & INIT =====
  function isAuthenticated() {
    return !!localStorage.getItem('token');
  }

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
      
      // Load other data...
      skillsList = data.skills || [];
      projectList = data.projects || [];
      updateAboutSkills();
      updateProjectsGrid();
    } catch (err) {
      console.error('Load portfolio failed:', err);
    }
  }

  function initAuth() {
    const loginLink = document.querySelector('#nav-links a[href="#login"]');
    if (isAuthenticated()) {
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      if (loginLink) loginLink.style.display = 'none';
      loadPortfolio();
    } else {
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (loginLink) {
        loginLink.style.display = 'inline-block';
        loginLink.href = 'login.html';
      }
    }
  }

  // ===== EVENT LISTENERS =====
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 300);
    });
  }

  const profileUpload = document.getElementById('profile-upload');
  if (profileUpload) {
    profileUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const heroImg = document.getElementById('hero-profile-img');
          if (heroImg) heroImg.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ===== OBSERVER - FIXED ESCAPING =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${index * 0.1}s`;
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(sectionObserver.observe);

  // ===== INIT =====
  initAuth();
});
