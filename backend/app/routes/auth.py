"""
Authentication routes - User signup and login endpoints with MongoDB
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserSignup, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import register_user, authenticate_user
from app.utils.mongo_helpers import serialize_doc

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(user_data: UserSignup):
    """
    Register a new user account.
    
    Args:
        user_data: User registration data (email, password, name)
        
    Returns:
        Access token and user information
    """
    # Register user
    user = await register_user(user_data)
    
    # Generate token
    from app.auth.jwt_handler import create_access_token
    access_token = create_access_token({"user_id": str(user["_id"])})
    
    # Serialize user document
    user_serialized = serialize_doc(user)
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(**user_serialized)
    )

@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    """
    Authenticate user and return access token.
    
    Args:
        login_data: User login credentials (email, password)
        
    Returns:
        Access token and user information
    """
    # Authenticate user
    user, access_token = await authenticate_user(login_data)
    
    # Serialize user document
    user_serialized = serialize_doc(user)
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(**user_serialized)
    )
