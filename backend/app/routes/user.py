"""
User profile routes - User profile management endpoints with MongoDB
"""
from fastapi import APIRouter, Depends
from bson import ObjectId
from app.database import get_database
from app.schemas.user import UserProfile, UserResponse
from app.utils.dependencies import get_current_user
from app.utils.mongo_helpers import serialize_doc

router = APIRouter(prefix="/api/user", tags=["User Profile"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user's profile information.
    
    Args:
        current_user: Authenticated user from JWT token
        
    Returns:
        User profile information
    """
    user_serialized = serialize_doc(current_user)
    return UserResponse(**user_serialized)

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: UserProfile,
    current_user: dict = Depends(get_current_user)
):
    """
    Update current user's profile information.
    
    Args:
        profile_data: Updated profile data
        current_user: Authenticated user from JWT token
        
    Returns:
        Updated user profile information
    """
    db = get_database()
    
    # Build update document
    update_doc = {}
    if profile_data.name is not None:
        update_doc["name"] = profile_data.name
    if profile_data.age is not None:
        update_doc["age"] = profile_data.age
    if profile_data.height is not None:
        update_doc["height"] = profile_data.height
    if profile_data.weight is not None:
        update_doc["weight"] = profile_data.weight
    if profile_data.fitness_goal is not None:
        update_doc["fitness_goal"] = profile_data.fitness_goal
    
    # Update user in MongoDB
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": update_doc}
    )
    
    # Fetch updated user
    updated_user = await db.users.find_one({"_id": current_user["_id"]})
    user_serialized = serialize_doc(updated_user)
    
    return UserResponse(**user_serialized)
