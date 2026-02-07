"""
Configuration management for the application.
Loads environment variables and provides centralized config access.
"""
import os
import secrets
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings loaded from environment variables"""
    
    # MongoDB Atlas configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mongodb://localhost:27017"
    )
    
    # JWT configuration
    JWT_SECRET: str = os.getenv("JWT_SECRET", secrets.token_urlsafe(32))
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Google Gemini API configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Razorpay Payment Gateway configuration
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    
    # CORS configuration
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # File upload configuration
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Application metadata
    APP_NAME: str = "AI Fitness & Food Tracking App"
    VERSION: str = "1.0.0"

# Create settings instance
settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Print JWT secret for user reference (only in development)
if not os.getenv("JWT_SECRET"):
    print(f"\n⚠️  No JWT_SECRET found in .env file!")
    print(f"📝 Generated JWT Secret: {settings.JWT_SECRET}")
    print(f"💡 Add this to your .env file:\n   JWT_SECRET={settings.JWT_SECRET}\n")
