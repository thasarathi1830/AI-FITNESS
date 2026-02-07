"""
Goals model - Stores daily fitness goals
"""
from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Goals(Base):
    """Goals model for tracking daily calorie goals"""
    
    __tablename__ = "goals"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Goal details
    daily_calorie_intake_goal = Column(Float, nullable=False)  # Target calories to consume
    daily_calorie_burn_goal = Column(Float, nullable=False)  # Target calories to burn
    
    # Date tracking
    date = Column(Date, nullable=False, unique=False)  # Date for this goal
    
    # Relationship
    user = relationship("User", back_populates="goals")
    
    def __repr__(self):
        return f"<Goals(id={self.id}, intake={self.daily_calorie_intake_goal}, burn={self.daily_calorie_burn_goal})>"
