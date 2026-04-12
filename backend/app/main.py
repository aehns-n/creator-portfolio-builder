from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

from app .database import engine, get_db
from . import models, schemas
from app.security import hash_password, verify_password
from app.auth import get_current_user, create_access_token

from pydantic import BaseModel, EmailStr
from typing import List, Dict

# ===== INIT =====
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# ===== CORS =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== HOME =====
@app.get("/")
def home():
    return {"message": "Creator Portfolio Backend Running"}


# ===== SIGNUP =====
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


# ===== LOGIN (JWT) =====
@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"user_id": db_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ===== SKILLS (PROTECTED + FIXED) =====
@app.post("/skills")
def add_skill(
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    skill_name = skill.name.lower().strip()

    # 🔥 DUPLICATE CHECK
    existing_skill = db.query(models.Skill).filter(
        models.Skill.name == skill_name,
        models.Skill.user_id == current_user.id
    ).first()

    if existing_skill:
        raise HTTPException(status_code=400, detail="Skill already exists")

    new_skill = models.Skill(
        name=skill_name,
        user_id=current_user.id
    )

    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)

    return {"message": f"Skill added for {current_user.name}"}


# ===== PROJECTS (PROTECTED + OPTIONAL DUPLICATE FIX) =====
@app.post("/projects")
def add_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    # 🔥 DUPLICATE CHECK
    existing_project = db.query(models.Project).filter(
        models.Project.title == project.title,
        models.Project.description == project.description,
        models.Project.user_id == current_user.id
    ).first()

    if existing_project:
        raise HTTPException(status_code=400, detail="Project already exists")

    new_project = models.Project(
        title=project.title,
        description=project.description,
        tech_stack=project.tech_stack,
        user_id=current_user.id
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {"message": f"Project added for {current_user.name}"}

# ===== GET MY PORTFOLIO (JWT BASED) =====
@app.get("/my-portfolio")
def get_my_portfolio(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    skills = db.query(models.Skill).filter(models.Skill.user_id == current_user.id).all()
    projects = db.query(models.Project).filter(models.Project.user_id == current_user.id).all()

    return {
        "name": current_user.name,
        "skills": list(set([skill.name.capitalize() for skill in skills])),  # 🔥 remove duplicates + format
        "projects": [
            {
                "title": project.title,
                "description": project.description,
                "tech": project.tech_stack
            }
            for project in projects
        ]
    }


# ===== CONTACT =====
class Contact(BaseModel):
    name: str
    email: EmailStr
    message: str


@app.post("/contact")
def contact(data: Contact):
    return {
        "message": f"Thanks {data.name}, message received!"
    }


# ===== SAVE PORTFOLIO (PROTECTED) =====
class Portfolio(BaseModel):
    name: str
    title: str
    skills: List[str]
    projects: List[Dict]


@app.post("/save-portfolio")
def save_portfolio(
    data: Portfolio,
    current_user: models.User = Depends(get_current_user)
):
    return {
        "message": f"Portfolio saved for {current_user.name}",
        "data": data
    }