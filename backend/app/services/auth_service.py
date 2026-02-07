"""
Authentication service - Business logic for user authentication with MongoDB
"""
from fastapi import HTTPException, status
from datetime import datetime
from app.database import get_database
from app.schemas.user import UserSignup, UserLogin
from app.auth.password import hash_password, verify_password
from app.auth.jwt_handler import create_access_token

async def register_user(user_data: UserSignup):
    """
    Register a new user in MongoDB.
    
    Args:
        user_data: User registration data
        
    Returns:
        Created user document
        
    Raises:
        HTTPException: If email already exists
    """
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user document
    hashed_pwd = hash_password(user_data.password)
    user_doc = {
        "email": user_data.email,
        "hashed_password": hashed_pwd,
        "name": user_data.name,
        "age": None,
        "height": None,
        "weight": None,
        "fitness_goal": None,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    return user_doc

async def authenticate_user(login_data: UserLogin):
    """
    Authenticate user and generate access token.
    
    Args:
        login_data: User login credentials
        
    Returns:
        Tuple of (user document, access token)
        
    Raises:
        HTTPException: If credentials are invalid
    """
    db = get_database()
    
    # Find user by email
    user = await db.users.find_one({"email": login_data.email})
    
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Generate access token
    access_token = create_access_token({"user_id": str(user["_id"])})
    
    return user, access_token
