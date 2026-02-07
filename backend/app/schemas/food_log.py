"""
FoodLog schemas for request/response validation
"""
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class FoodLogManual(BaseModel):
    """Schema for manual food entry"""
    food_name: str
    quantity: Optional[str] = None
    calories: float
    date: date

class FoodLogResponse(BaseModel):
    """Schema for food log response"""
    id: str  # Changed from int to str for MongoDB ObjectId
    user_id: str  # Changed from int to str for MongoDB
    food_name: str
    quantity: Optional[str]
    calories: float
    image_path: Optional[str]
    is_ai_detected: bool
    meal_type: Optional[str] = None
    protein: Optional[str] = None
    carbs: Optional[str] = None
    fats: Optional[str] = None
    date: str  # Changed to str since we store as ISO string
    created_at: str  # Changed to str since we store as ISO string
    
    class Config:
        from_attributes = True

class AIFoodAnalysis(BaseModel):
    """Schema for AI food analysis result"""
    food_name: str
    calories: float
    protein: Optional[str] = None
    carbs: Optional[str] = None
    fats: Optional[str] = None
    description: Optional[str] = None
    confidence: Optional[str] = None
