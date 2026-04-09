// ===== CONTACT FORM =====
const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");

if (form) {
form.addEventListener("submit", async function (e) {
e.preventDefault();

const name = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");

[name,email,message].forEach(input => input.classList.remove("input-error"));
[nameError,emailError,messageError].forEach(el => el.textContent="");

let isValid=true;

if(name.value.trim()===""){
nameError.textContent="Name is required.";
name.classList.add("input-error");
isValid=false;
}

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailPattern.test(email.value.trim())){
emailError.textContent="Enter a valid email address.";
email.classList.add("input-error");
isValid=false;
}

if(message.value.trim().length<10){
messageError.textContent="Message must be at least 10 characters.";
message.classList.add("input-error");
isValid=false;
}

if(!isValid) return;

const submitBtn=form.querySelector(".cta-btn");
submitBtn.disabled=true;
submitBtn.textContent="Sending...";

statusText.textContent="⏳ Sending message...";
statusText.style.color="blue";

try{
const response=await fetch("http://127.0.0.1:8000/contact",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
name:name.value.trim(),
email:email.value.trim(),
message:message.value.trim(),
}),
});

const data = await response.json();

if(response.ok){
statusText.textContent=data.message || "✅ Message sent successfully!";
statusText.style.color="green";
form.reset();
}else{
statusText.textContent=data.detail || "❌ Failed to send message.";
statusText.style.color="red";
}

}catch(error){
statusText.textContent="⚠️ Server not reachable.";
statusText.style.color="red";
}

submitBtn.disabled=false;
submitBtn.textContent="Send Message";

});
}


// ===== BUILDER =====
const builderForm=document.getElementById("builder-form");
const builderName=document.getElementById("builder-name");
const builderTitle=document.getElementById("builder-title");

const heroName=document.getElementById("creator-name");
const heroTitle=document.getElementById("creator-title");

builderName?.addEventListener("input",()=>{
heroName.textContent= builderName.value || "Creator";
});

builderTitle?.addEventListener("input",()=>{
heroTitle.textContent= builderTitle.value || "Web Developer";
});


// ===== SKILLS =====
const addSkillBtn=document.getElementById("add-skill-btn");
const skillInput=document.getElementById("skill-input");
const skillsPreview=document.getElementById("skills-preview");
const aboutSkills=document.getElementById("about-skills");

let skillsList=[];

skillInput?.addEventListener("keydown",(e)=>{
if(e.key==="Enter"){
e.preventDefault();
addSkillBtn.click();
}
});

addSkillBtn?.addEventListener("click",()=>{
const skillValue=skillInput.value.trim().toLowerCase();
if(!skillValue || skillsList.includes(skillValue)) return;

skillsList.push(skillValue);

const chip=document.createElement("span");
chip.className="skill-chip";
chip.textContent=skillValue;

const removeBtn=document.createElement("span");
removeBtn.textContent=" ✕";

removeBtn.onclick=()=>{
skillsList=skillsList.filter(s=>s!==skillValue);
chip.remove();
};

chip.appendChild(removeBtn);
skillsPreview.appendChild(chip);

skillInput.value="";
});


// ===== PROJECTS =====
const addProjectBtn=document.getElementById("add-project-btn");
const projectPreview=document.getElementById("project-preview");
const projectsGrid=document.getElementById("projects-grid");

let projectList=[];

addProjectBtn?.addEventListener("click",()=>{

const title=document.getElementById("project-title").value.trim();
const desc=document.getElementById("project-desc").value.trim();
const image=document.getElementById("project-image").value.trim();

if(!title || !desc) return;

const project={ title, desc, image:image || "https://picsum.photos/400/250" };

const exists = projectList.some(p => p.title === title && p.desc === desc);
if(exists) return;

projectList.push(project);

const card=document.createElement("div");
card.className="project-card";

card.innerHTML=`
<img src="${project.image}" 
     onerror="this.src='https://picsum.photos/400/250'">
<h3>${project.title}</h3>
<p>${project.desc}</p>
`;

const del = document.createElement("button");
del.textContent = "Delete";
del.className = "delete-project-btn";

del.onclick=()=>{
projectList=projectList.filter(p=>p!==project);
card.remove();
};

card.appendChild(del);
projectPreview.appendChild(card);

["project-title","project-desc","project-image"].forEach(id=>document.getElementById(id).value="");
});


// ===== BUILDER SUBMIT =====
builderForm?.addEventListener("submit", async (e)=>{
e.preventDefault();

const nameInput=builderName.value.trim();
const titleInput=builderTitle.value.trim();

if(nameInput) heroName.textContent=nameInput;
if(titleInput) heroTitle.textContent=titleInput;

// skills render
aboutSkills.innerHTML="";
skillsList.forEach(skill=>{
const chip=document.createElement("span");
chip.className="skill-chip";
chip.textContent=skill;
aboutSkills.appendChild(chip);
});

// projects render
projectsGrid.innerHTML="";
projectList.forEach(project=>{
const card=document.createElement("div");
card.className="project-card";

card.innerHTML=`
<img src="${project.image}" 
     onerror="this.src='https://picsum.photos/400/250'">
<h3>${project.title}</h3>
<p>${project.desc}</p>
`;

projectsGrid.appendChild(card);
});

// 🔥 SHOW DOWNLOAD BUTTON
document.getElementById("download-btn").style.display = "block";

// 🔥 SCROLL
document.getElementById("home").scrollIntoView({ behavior:"smooth" });

// save
const token = localStorage.getItem("token");

try{
await fetch("http://127.0.0.1:8000/save-portfolio", {
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + token
},
body:JSON.stringify({
name:nameInput,
title:titleInput,
skills:skillsList,
projects:projectList
})
});
}catch(err){
console.error(err);
}

});


// ===== LOGIN =====
const loginForm = document.getElementById("login-form");

if (loginForm) {
loginForm.addEventListener("submit", async function(e){
e.preventDefault();
const loginForm = document.getElementById("login-form");

if (loginForm) {
loginForm.addEventListener("submit", async function(e){
e.preventDefault();

const email = document.getElementById("login-email").value.trim();
const password = document.getElementById("login-password").value.trim();

if(!email || !password){
alert("Enter email & password");
return;
}

try{

const formData = new URLSearchParams();
formData.append("username", email);
formData.append("password", password);

const res = await fetch("http://127.0.0.1:8000/login", {
method:"POST",
headers:{ "Content-Type":"application/x-www-form-urlencoded" },
body:formData
});

const data = await res.json();

if(res.ok){
localStorage.setItem("token", data.access_token);
alert("Login success ✅");

// 🔥 REDIRECT FIX
window.location.href = "index.html";

}else{
alert(data.detail || "Login failed ❌");
}

}catch(err){
console.error(err);
alert("Server error ⚠️");
}

});
}
});
}


// ===== LOAD PORTFOLIO =====
async function loadPortfolio(){
const token = localStorage.getItem("token");
if(!token) return;

const res = await fetch("http://127.0.0.1:8000/my-portfolio",{
headers:{ "Authorization":"Bearer " + token }
});

const data = await res.json();

heroName.textContent = data.name;

aboutSkills.innerHTML="";
data.skills.forEach(skill=>{
const chip=document.createElement("span");
chip.className="skill-chip";
chip.textContent=skill;
aboutSkills.appendChild(chip);
});

projectsGrid.innerHTML="";
data.projects.forEach(p=>{
const card=document.createElement("div");
card.className="project-card";

card.innerHTML=`
<h3>${p.title}</h3>
<p>${p.description}</p>
`;

projectsGrid.appendChild(card);
});
}


// ===== LOGOUT =====
function logout(){
localStorage.removeItem("token");

// 🔥 FULL RESET
location.reload();
}


// ===== TEMPLATE SWITCH (FIXED) =====
const templateCards = document.querySelectorAll('.template-card');
const portfolioContainer = document.getElementById("portfolio-container");

templateCards.forEach(card => {
card.addEventListener("click", () => {

templateCards.forEach(c => c.classList.remove("active"));
card.classList.add("active");

portfolioContainer.className = "portfolio " + card.dataset.template;

});
});


// ===== DOWNLOAD =====
document.getElementById("download-btn")?.addEventListener("click", () => {

const name = document.getElementById("creator-name").textContent;
const title = document.getElementById("creator-title").textContent;

// 🔥 CLEAN CONTENT
const content = `
<h1>Hello, I'm ${name} 🚀</h1>
<p>${title}</p>

<h2>Skills</h2>
${document.getElementById("about-skills").innerHTML}

<h2>Projects</h2>
${document.getElementById("projects-grid").innerHTML}
`;

const html = `
<!DOCTYPE html>
<html>
<head>
<title>${name} Portfolio</title>
<style>
body{
  font-family: Arial;
  background:#0f172a;
  color:white;
  padding:40px;
}
.project-card{
  border:1px solid #333;
  padding:15px;
  margin:10px 0;
}
img{
  width:100%;
}
</style>
</head>

<body>
${content}
</body>
</html>
`;

const blob = new Blob([html], { type: "text/html" });

const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = `${name}_portfolio.html`;

link.click();

});


// ===== AUTH UI =====
function showLoggedInUI(){
const nav = document.getElementById("nav-links");
nav.innerHTML = `
<a href="#home">Home</a>
<a href="#about">About</a>
<a href="#projects">Projects</a>
<a href="#contact">Contact</a>
<a href="#" onclick="logout()">Logout</a>
`;
}

function showLoginUI(){
const nav = document.getElementById("nav-links");
nav.innerHTML = `
<a href="#login">Login</a>
<a href="#home">Home</a>
<a href="#about">About</a>
<a href="#projects">Projects</a>
<a href="#contact">Contact</a>
`;
}


// ===== AUTO LOAD =====
window.addEventListener("load", ()=>{
const token = localStorage.getItem("token");

if(token){
showLoggedInUI();
loadPortfolio();
}else{
showLoginUI();
}
});

document.querySelector(".cta-btn")?.addEventListener("click", ()=>{
document.getElementById("projects").scrollIntoView({
behavior:"smooth"
});
});