from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SkillCreate(BaseModel):
    name: str

class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: str