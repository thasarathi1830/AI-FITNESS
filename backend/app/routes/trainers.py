"""
Trainer routes - Browse and book personal trainers
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.database import get_database
from app.schemas.trainer import TrainerCreate, TrainerResponse, BookingCreate, BookingResponse
from app.utils.dependencies import get_current_user
from app.utils.mongo_helpers import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/trainers", tags=["Trainers"])

@router.post("/register", response_model=TrainerResponse, status_code=201)
async def register_trainer(trainer_data: TrainerCreate):
    """Register as a personal trainer"""
    db = get_database()
    
    # Check if email already exists
    existing = await db.trainers.find_one({"email": trainer_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered as trainer")
    
    trainer_doc = {
        **trainer_data.dict(),
        "rating": 0.0,
        "total_reviews": 0,
        "is_verified": False,
        "created_at": datetime.utcnow()
    }
    
    result = await db.trainers.insert_one(trainer_doc)
    trainer_doc["_id"] = result.inserted_id
    
    return TrainerResponse(**serialize_doc(trainer_doc))

@router.get("", response_model=List[TrainerResponse])
async def get_trainers(
    specialization: Optional[str] = None,
    min_rating: Optional[float] = None
):
    """Get list of all trainers with optional filters"""
    db = get_database()
    
    query = {}  # Show all trainers, including unverified
    if specialization:
        query["specialization"] = specialization
    if min_rating:
        query["rating"] = {"$gte": min_rating}
    
    cursor = db.trainers.find(query).sort("rating", -1).limit(50)
    trainers = await cursor.to_list(length=50)
    
    return [TrainerResponse(**serialize_doc(t)) for t in trainers]

@router.get("/{trainer_id}", response_model=TrainerResponse)
async def get_trainer(trainer_id: str):
    """Get trainer details by ID"""
    db = get_database()
    
    try:
        trainer = await db.trainers.find_one({"_id": ObjectId(trainer_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid trainer ID")
    
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    
    return TrainerResponse(**serialize_doc(trainer))

@router.post("/{trainer_id}/book", response_model=BookingResponse, status_code=201)
async def book_trainer(
    trainer_id: str,
    booking_data: BookingCreate,
    current_user: dict = Depends(get_current_user)
):
    """Book a session with a trainer"""
    db = get_database()
    
    # Get trainer
    try:
        trainer = await db.trainers.find_one({"_id": ObjectId(trainer_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid trainer ID")
    
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    
    # Calculate total amount
    total_amount = trainer["hourly_rate"] * booking_data.duration_hours
    
    # Create booking
    booking_doc = {
        "user_id": str(current_user["_id"]),
        "trainer_id": trainer_id,
        "trainer_name": trainer["name"],
        "session_date": booking_data.session_date,
        "duration_hours": booking_data.duration_hours,
        "total_amount": total_amount,
        "payment_id": None,
        "payment_status": "pending",
        "status": "pending",
        "notes": booking_data.notes,
        "created_at": datetime.utcnow()
    }
    
    result = await db.bookings.insert_one(booking_doc)
    booking_doc["_id"] = result.inserted_id
    
    return BookingResponse(**serialize_doc(booking_doc))

@router.get("/bookings/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(current_user: dict = Depends(get_current_user)):
    """Get current user's bookings"""
    db = get_database()
    
    cursor = db.bookings.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    bookings = await cursor.to_list(length=100)
    
    return [BookingResponse(**serialize_doc(b)) for b in bookings]
