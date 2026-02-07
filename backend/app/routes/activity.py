"""
Activity tracking routes - Simplified for MongoDB
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from app.schemas.activity_log import ActivityLogCreate, ActivityLogResponse
from app.utils.dependencies import get_current_user
from app.services.calorie_service import calculate_calories_burned
from app.database import get_database
from app.utils.mongo_helpers import serialize_doc

router = APIRouter(prefix="/api/activity", tags=["Activity Tracking"])

@router.post("", response_model=ActivityLogResponse, status_code=201)
async def add_activity(
    activity_data: ActivityLogCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add a fitness activity"""
    db = get_database()
    
    # Check if database is available
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    try:
        user_weight = current_user.get("weight", 70.0)
        calories_burned = calculate_calories_burned(
            activity_data.activity_type,
            activity_data.duration_minutes,
            user_weight
        )
        
        activity_doc = {
            "user_id": str(current_user["_id"]),
            "activity_type": activity_data.activity_type,
            "duration_minutes": activity_data.duration_minutes,
            "calories_burned": calories_burned,
            "date": activity_data.date.isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = await db.activity_logs.insert_one(activity_doc)
        activity_doc["_id"] = result.inserted_id
        
        return ActivityLogResponse(**serialize_doc(activity_doc))
    except Exception as e:
        print(f"Error logging activity: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to log activity: {str(e)}")

@router.get("/logs", response_model=List[ActivityLogResponse])
async def get_activity_logs(
    date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get activity logs"""
    db = get_database()
    query = {"user_id": str(current_user["_id"])}
    
    if date:
        query["date"] = date
    
    cursor = db.activity_logs.find(query).sort("date", -1).limit(50)
    logs = await cursor.to_list(length=50)
    
    return [ActivityLogResponse(**serialize_doc(log)) for log in logs]
