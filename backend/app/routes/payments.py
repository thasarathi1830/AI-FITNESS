"""
Payment routes - Razorpay payment integration
"""
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.database import get_database
from app.schemas.trainer import PaymentOrderCreate, PaymentVerify
from app.services.razorpay_service import create_razorpay_order, verify_payment_signature
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.post("/create-order")
async def create_payment_order(
    order_data: PaymentOrderCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a Razorpay order for booking payment"""
    db = get_database()
    
    # Get booking
    try:
        booking = await db.bookings.find_one({"_id": ObjectId(order_data.booking_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid booking ID")
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify booking belongs to user
    if booking["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Create Razorpay order
    razorpay_order = create_razorpay_order(booking["total_amount"])
    
    # Update booking with order ID
    await db.bookings.update_one(
        {"_id": booking["_id"]},
        {"$set": {"razorpay_order_id": razorpay_order["id"]}}
    )
    
    return {
        "order_id": razorpay_order["id"],
        "amount": razorpay_order["amount"],
        "currency": razorpay_order["currency"],
        "booking_id": order_data.booking_id
    }

@router.post("/verify")
async def verify_payment(
    payment_data: PaymentVerify,
    current_user: dict = Depends(get_current_user)
):
    """Verify Razorpay payment and update booking status"""
    db = get_database()
    
    # Verify signature
    is_valid = verify_payment_signature(
        payment_data.razorpay_order_id,
        payment_data.razorpay_payment_id,
        payment_data.razorpay_signature
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Update booking
    try:
        result = await db.bookings.update_one(
            {"_id": ObjectId(payment_data.booking_id), "user_id": str(current_user["_id"])},
            {"$set": {
                "payment_id": payment_data.razorpay_payment_id,
                "payment_status": "completed",
                "status": "scheduled"
            }}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Booking not found or not authorized")
        
        return {"success": True, "message": "Payment verified successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
