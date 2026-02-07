"""
Goals schemas for request/response validation
"""
from pydantic import BaseModel
from datetime import date

class GoalsCreate(BaseModel):
    """Schema for creating/updating goals"""
    daily_calorie_intake_goal: float
    daily_calorie_burn_goal: float
    date: date

class GoalsResponse(BaseModel):
    """Schema for goals response"""
    id: int
    user_id: int
    daily_calorie_intake_goal: float
    daily_calorie_burn_goal: float
    date: date
    
    class Config:
        from_attributes = True
