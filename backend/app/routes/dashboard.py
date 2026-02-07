"""
Dashboard routes - Simplified for MongoDB
"""
from fastapi import APIRouter, Depends
from typing import Optional
from datetime import datetime, date as date_type
from pydantic import BaseModel
from app.utils.dependencies import get_current_user
from app.database import get_database

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

class DailySummary(BaseModel):
    """Schema for daily summary response"""
    date: str
    total_calories_consumed: float
    total_calories_burned: float
    net_calories: float
    calories_left: float  # New field: remaining calories for the day
    calorie_intake_goal: Optional[float] = None
    calorie_burn_goal: Optional[float] = None
    intake_progress_percentage: Optional[float] = None
    burn_progress_percentage: Optional[float] = None
    food_log_count: int
    activity_log_count: int

@router.get("/summary", response_model=DailySummary)
async def get_daily_summary(
    date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get daily summary with calories and progress"""
    db = get_database()
    
    target_date = date if date else date_type.today().isoformat()
    user_id = str(current_user["_id"])
    
    # Get food logs
    food_cursor = db.food_logs.find({"user_id": user_id, "date": target_date})
    food_logs = await food_cursor.to_list(length=1000)
    total_consumed = sum(log.get("calories", 0) for log in food_logs)
    
    # Get activity logs
    activity_cursor = db.activity_logs.find({"user_id": user_id, "date": target_date})
    activity_logs = await activity_cursor.to_list(length=1000)
    total_burned = sum(log.get("calories_burned", 0) for log in activity_logs)
    
    # Get goals
    goals = await db.goals.find_one({"user_id": user_id, "date": target_date})
    
    intake_goal = goals.get("daily_calorie_intake_goal") if goals else None
    burn_goal = goals.get("daily_calorie_burn_goal") if goals else None
    
    intake_progress = (total_consumed / intake_goal * 100) if intake_goal else None
    burn_progress = (total_burned / burn_goal * 100) if burn_goal else None
    
    # Calculate calories left: goal - consumed + burned
    default_goal = 2100  # Default daily calorie goal
    calories_left = (intake_goal or default_goal) - total_consumed + total_burned
    
    return DailySummary(
        date=target_date,
        total_calories_consumed=round(total_consumed, 2),
        total_calories_burned=round(total_burned, 2),
        net_calories=round(total_consumed - total_burned, 2),
        calories_left=round(calories_left, 2),
        calorie_intake_goal=intake_goal,
        calorie_burn_goal=burn_goal,
        intake_progress_percentage=round(intake_progress, 2) if intake_progress else None,
        burn_progress_percentage=round(burn_progress, 2) if burn_progress else None,
        food_log_count=len(food_logs),
        activity_log_count=len(activity_logs)
    )
