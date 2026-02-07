"""
User-related Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserSignup(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    """Schema for updating user profile"""
    name: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitness_goal: Optional[str] = None

class UserResponse(BaseModel):
    """Schema for user response (MongoDB compatible)"""
    id: str  # MongoDB uses string IDs
    email: str
    name: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitness_goal: Optional[str] = None
    created_at: Optional[datetime] = None  # Optional for MongoDB

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
