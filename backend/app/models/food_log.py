"""
FoodLog model - Stores food intake records
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class FoodLog(Base):
    """FoodLog model for tracking food intake"""
    
    __tablename__ = "food_logs"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Food details
    food_name = Column(String, nullable=False)
    quantity = Column(String, nullable=True)  # e.g., "1 plate", "200g"
    calories = Column(Float, nullable=False)
    
    # Image and AI detection
    image_path = Column(String, nullable=True)  # Path to uploaded image
    is_ai_detected = Column(Boolean, default=False)  # Whether AI was used
    
    # Date tracking
    date = Column(Date, nullable=False)  # Date of consumption
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="food_logs")
    
    def __repr__(self):
        return f"<FoodLog(id={self.id}, food={self.food_name}, calories={self.calories})>"
