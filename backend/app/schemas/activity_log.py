"""
ActivityLog schemas for request/response validation
"""
from pydantic import BaseModel
from datetime import date, datetime

class ActivityLogCreate(BaseModel):
    """Schema for creating activity log"""
    activity_type: str  # walking, running, cycling, gym
    duration_minutes: int
    date: date

class ActivityLogResponse(BaseModel):
    """Schema for activity log response"""
    id: str  # Changed from int to str for MongoDB ObjectId
    user_id: str  # Changed from int to str for MongoDB
    activity_type: str
    duration_minutes: int
    calories_burned: float
    date: str  # Changed to str since we store as ISO string
    created_at: str  # Changed to str since we store as ISO string
    
    class Config:
        from_attributes = True
