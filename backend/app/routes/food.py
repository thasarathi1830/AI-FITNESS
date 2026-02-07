"""
Food tracking routes - Simplified for MongoDB (basic functionality)
"""
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
from datetime import datetime
from app.schemas.food_log import FoodLogManual, FoodLogResponse, AIFoodAnalysis
from app.utils.dependencies import get_current_user
from app.services.gemini_service import analyze_food_image, save_uploaded_image
from app.database import get_database
from app.utils.mongo_helpers import serialize_doc, serialize_docs
from bson import ObjectId

router = APIRouter(prefix="/api/food", tags=["Food Tracking"])

@router.post("/manual", response_model=FoodLogResponse, status_code=201)
async def add_manual_food(
    food_data: FoodLogManual,
    current_user: dict = Depends(get_current_user)
):
    """Add a manual food entry"""
    db = get_database()
    
    # Check if database is available
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    try:
        food_doc = {
            "user_id": str(current_user["_id"]),
            "food_name": food_data.food_name,
            "quantity": food_data.quantity,
            "calories": food_data.calories,
            "image_path": None,
            "is_ai_detected": False,
            "date": food_data.date.isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = await db.food_logs.insert_one(food_doc)
        food_doc["_id"] = result.inserted_id
        
        return FoodLogResponse(**serialize_doc(food_doc))
    except Exception as e:
        print(f"Error logging food: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to log food: {str(e)}")

@router.post("/upload", response_model=FoodLogResponse, status_code=201)
async def upload_food_image(
    image: UploadFile = File(...),
    date: str = Form(...),
    meal_type: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """Upload food image for AI analysis"""
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        food_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    ai_result = await analyze_food_image(image)
    image_path = await save_uploaded_image(image)
    
    # Use meal_type if provided, otherwise try to infer or default
    final_meal_type = meal_type if meal_type else "Snack" 
    
    db = get_database()
    food_doc = {
        "user_id": str(current_user["_id"]),
        "food_name": ai_result.food_name,
        "quantity": None,
        "calories": ai_result.calories,
        "protein": ai_result.protein,
        "carbs": ai_result.carbs,
        "fats": ai_result.fats,
        "image_path": image_path,
        "is_ai_detected": True,
        "meal_type": final_meal_type,
        "date": food_date.isoformat(),
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = await db.food_logs.insert_one(food_doc)
    food_doc["_id"] = result.inserted_id
    
    return FoodLogResponse(**serialize_doc(food_doc))

@router.post("/upload-image")
async def analyze_food_image_only(
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Analyze food image with AI without logging to database"""
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Analyze the image with Gemini AI
        ai_result = await analyze_food_image(image)
        
        # Return the analysis result
        return {
            "success": True,
            "food_name": ai_result.food_name,
            "calories": ai_result.calories,
            "protein": ai_result.protein,
            "carbs": ai_result.carbs,
            "fats": ai_result.fats,
            "confidence": ai_result.confidence,
            "description": ai_result.description
        }
    except Exception as e:
        print(f"Error analyzing food image: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze food image: {str(e)}"
        )


@router.post("/quick-add", response_model=FoodLogResponse, status_code=201)
async def quick_add_meal(
    meal_type: str,
    current_user: dict = Depends(get_current_user)
):
    """Quick add a meal with default calories"""
    db = get_database()
    
    # Check if database is available
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    # Default calorie estimates for meal types
    meal_calories = {
        "breakfast": 400,
        "lunch": 600,
        "dinner": 700,
        "snack": 200
    }
    
    meal_type_lower = meal_type.lower()
    if meal_type_lower not in meal_calories:
        raise HTTPException(status_code=400, detail="Invalid meal type")
    
    try:
        food_doc = {
            "user_id": str(current_user["_id"]),
            "food_name": meal_type.capitalize(),
            "quantity": "1 serving",
            "calories": meal_calories[meal_type_lower],
            "image_path": None,
            "is_ai_detected": False,
            "date": datetime.utcnow().date().isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = await db.food_logs.insert_one(food_doc)
        food_doc["_id"] = result.inserted_id
        
        return FoodLogResponse(**serialize_doc(food_doc))
    except Exception as e:
        print(f"Error quick adding meal: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to log meal: {str(e)}")

@router.get("/logs", response_model=List[FoodLogResponse])
async def get_food_logs(
    date: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get food logs"""
    db = get_database()
    query = {"user_id": str(current_user["_id"])}
    
    if date:
        query["date"] = date
    
    cursor = db.food_logs.find(query).sort("date", -1).limit(50)
    logs = await cursor.to_list(length=50)
    
    return [FoodLogResponse(**serialize_doc(log)) for log in logs]

@router.delete("/logs/{log_id}", status_code=204)
async def delete_food_log(
    log_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a food log entry"""
    db = get_database()
    
    # Check if database is available
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    
    try:
        # Verify the log belongs to the current user
        log = await db.food_logs.find_one({
            "_id": ObjectId(log_id),
            "user_id": str(current_user["_id"])
        })
        
        if not log:
            raise HTTPException(status_code=404, detail="Food log not found")
        
        # Delete the log
        result = await db.food_logs.delete_one({
            "_id": ObjectId(log_id),
            "user_id": str(current_user["_id"])
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Food log not found")
        
        return None
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Error deleting food log: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete food log: {str(e)}")
