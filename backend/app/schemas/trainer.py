"""
Trainer-related Pydantic schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class TrainerCreate(BaseModel):
    """Schema for trainer registration"""
    name: str
    email: EmailStr
    specialization: str  # "Weight Loss", "Muscle Gain", "Yoga", etc.
    bio: str
    experience_years: int
    certifications: List[str]
    hourly_rate: float
    availability: List[str]  # Days available
    profile_image: Optional[str] = None

class TrainerResponse(BaseModel):
    """Schema for trainer response"""
    id: str
    name: str
    email: str
    specialization: str
    bio: str
    experience_years: int
    certifications: List[str]
    hourly_rate: float
    rating: float
    total_reviews: int
    profile_image: Optional[str] = None
    availability: List[str]
    is_verified: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    """Schema for creating a booking"""
    trainer_id: str
    session_date: datetime
    duration_hours: float
    notes: Optional[str] = None

class BookingResponse(BaseModel):
    """Schema for booking response"""
    id: str
    user_id: str
    trainer_id: str
    trainer_name: str
    session_date: datetime
    duration_hours: float
    total_amount: float
    payment_id: Optional[str] = None
    payment_status: str  # "pending", "completed", "failed"
    status: str  # "scheduled", "completed", "cancelled"
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PaymentOrderCreate(BaseModel):
    """Schema for creating Razorpay order"""
    booking_id: str
    amount: float

class PaymentVerify(BaseModel):
    """Schema for verifying Razorpay payment"""
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    booking_id: str
