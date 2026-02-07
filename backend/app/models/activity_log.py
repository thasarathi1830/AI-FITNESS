"""
ActivityLog model - Stores fitness activity records
"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ActivityLog(Base):
    """ActivityLog model for tracking fitness activities"""
    
    __tablename__ = "activity_logs"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Activity details
    activity_type = Column(String, nullable=False)  # e.g., "walking", "running", "cycling", "gym"
    duration_minutes = Column(Integer, nullable=False)  # Duration in minutes
    calories_burned = Column(Float, nullable=False)  # Calculated calories burned
    
    # Date tracking
    date = Column(Date, nullable=False)  # Date of activity
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="activity_logs")
    
    def __repr__(self):
        return f"<ActivityLog(id={self.id}, activity={self.activity_type}, calories={self.calories_burned})>"
