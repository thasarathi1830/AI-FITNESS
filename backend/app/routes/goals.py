"""
Goals routes - Simplified for MongoDB
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from datetime import datetime, date as date_type
from app.schemas.goals import GoalsCreate, GoalsResponse
from app.utils.dependencies import get_current_user
from app.database import get_database
from app.utils.mongo_helpers import serialize_doc

router = APIRouter(prefix="/api/goals", tags=["Goals"])

@router.post("", response_model=GoalsResponse, status_code=201)
async def set_goals(
    goals_data: GoalsCreate,
    current_user: dict = Depends(get_current_user)
):
    """Set or update daily goals"""
    db = get_database()
    
    # Check if goals exist for this date
    existing = await db.goals.find_one({
        "user_id": str(current_user["_id"]),
        "date": goals_data.date.isoformat()
    })
    
    goals_doc = {
        "user_id": str(current_user["_id"]),
        "daily_calorie_intake_goal": goals_data.daily_calorie_intake_goal,
        "daily_calorie_burn_goal": goals_data.daily_calorie_burn_goal,
        "date": goals_data.date.isoformat()
    }
    
    if existing:
        await db.goals.update_one(
            {"_id": existing["_id"]},
            {"$set": goals_doc}
        )
        updated = await db.goals.find_one({"_id": existing["_id"]})
        return GoalsResponse(**serialize_doc(updated))
    else:
        result = await db.goals.insert_one(goals_doc)
        goals_doc["_id"] = result.inserted_id
        return GoalsResponse(**serialize_doc(goals_doc))

@router.get("", response_model=GoalsResponse)
async def get_goals(
    date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get goals for a specific date"""
    db = get_database()
    
    target_date = date if date else date_type.today().isoformat()
    
    goals = await db.goals.find_one({
        "user_id": str(current_user["_id"]),
        "date": target_date
    })
    
    if not goals:
        raise HTTPException(status_code=404, detail="No goals set for this date")
    
    return GoalsResponse(**serialize_doc(goals))
