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
statusText.textContent="⏳ Sending...";
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
statusText.textContent=data.message || "✅ Sent!";
statusText.style.color="green";
}

form.reset();

}catch{
if(statusText){
statusText.textContent="⚠️ Error";
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
chip.textContent=val;
document.getElementById("skills-preview").appendChild(chip);

document.getElementById("skill-input").value="";
});


// ===== PROJECTS =====
let projectList=[];
document.getElementById("add-project-btn")?.addEventListener("click",()=>{
const title=document.getElementById("project-title").value;
const desc=document.getElementById("project-desc").value;

if(!title || !desc) return;

projectList.push({title,desc});

const card=document.createElement("div");
card.innerHTML=`<h3>${title}</h3><p>${desc}</p>`;
document.getElementById("project-preview").appendChild(card);
});


// ===== BUILDER SUBMIT =====
builderForm?.addEventListener("submit", async (e)=>{
e.preventDefault();

const nameInput=builderName.value;
const titleInput=builderTitle.value;

heroName.textContent=nameInput;
heroTitle.textContent=titleInput;

// render skills
const aboutSkills=document.getElementById("about-skills");
aboutSkills.innerHTML="";
skillsList.forEach(skill=>{
const chip=document.createElement("span");
chip.textContent=skill;
aboutSkills.appendChild(chip);
});

// render projects
const projectsGrid=document.getElementById("projects-grid");
projectsGrid.innerHTML="";
projectList.forEach(p=>{
const card=document.createElement("div");
card.innerHTML=`<h3>${p.title}</h3><p>${p.desc}</p>`;
projectsGrid.appendChild(card);
});

// show download
document.getElementById("download-btn").style.display="block";

// scroll
document.getElementById("home")?.scrollIntoView({behavior:"smooth"});

// save backend
const token=localStorage.getItem("token");
await fetch(`${BASE_URL}/save-portfolio`,{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
},
body:JSON.stringify({
name:nameInput,
title:titleInput,
skills:skillsList,
projects:projectList
})
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


// ===== DOWNLOAD (FIXED) =====
document.getElementById("download-btn")?.addEventListener("click",()=>{

const name=heroName.textContent;
const title=heroTitle.textContent;

const content=`
<h1>${name}</h1>
<p>${title}</p>

<h2>Skills</h2>
${document.getElementById("about-skills").innerHTML}

<h2>Projects</h2>
${document.getElementById("projects-grid").innerHTML}
`;

const html=`
<!DOCTYPE html>
<html>
<head>
<title>${name} Portfolio</title>
<style>
body{font-family:Arial;background:#111;color:white;padding:40px}
</style>
</head>
<body>
${content}
</body>
</html>
`;

const blob=new Blob([html],{type:"text/html"});
const link=document.createElement("a");

link.href=URL.createObjectURL(blob);
link.download=`${name}_portfolio.html`;

link.click();
});


// ===== LOGIN =====
const loginForm=document.getElementById("login-form");

loginForm?.addEventListener("submit",async(e)=>{
e.preventDefault();

const email=document.getElementById("login-email").value;
const password=document.getElementById("login-password").value;

const formData=new URLSearchParams();
formData.append("username",email);
formData.append("password",password);

const res=await fetch(`${BASE_URL}/login`,{
method:"POST",
headers:{ "Content-Type":"application/x-www-form-urlencoded" },
body:formData
});

const data=await res.json();

if(res.ok){
localStorage.setItem("token",data.access_token);
alert("Login success");
location.reload();
}else{
alert("Login failed");
}
});


// ===== LOAD =====
const token=localStorage.getItem("token");
if(token){
loadPortfolio();
}

async function loadPortfolio(){
const res=await fetch(`${BASE_URL}/my-portfolio`,{
headers:{ "Authorization":"Bearer "+token }
});
const data=await res.json();
heroName.textContent=data.name;
}


// ===== LOGOUT =====
window.logout=()=>{
localStorage.removeItem("token");
location.reload();
};

});