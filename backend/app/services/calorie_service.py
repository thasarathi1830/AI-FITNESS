"""
Calorie calculation service - Business logic for calorie estimation
"""

# Calorie burn rates per activity type (calories per minute for average person)
ACTIVITY_CALORIE_RATES = {
    "walking": 3.5,      # Moderate pace
    "running": 10.0,     # 6 mph pace
    "cycling": 7.0,      # Moderate pace
    "gym": 6.0,          # General strength training
    "yoga": 2.5,         # Hatha yoga
    "swimming": 8.0,     # Moderate pace
    "dancing": 4.5,      # General dancing
    "hiking": 5.0,       # General hiking
}

def calculate_calories_burned(activity_type: str, duration_minutes: int, weight_kg: float = 70) -> float:
    """
    Calculate calories burned for a given activity.
    
    Formula: Calories = MET * weight(kg) * duration(hours)
    Simplified: Using average rates per minute
    
    Args:
        activity_type: Type of activity (walking, running, etc.)
        duration_minutes: Duration of activity in minutes
        weight_kg: User's weight in kg (default 70kg)
        
    Returns:
        Estimated calories burned
    """
    # Default to 70kg if weight is None or invalid
    if weight_kg is None or weight_kg <= 0:
        weight_kg = 70.0
    
    # Get base rate for activity type (default to 5.0 if not found)
    base_rate = ACTIVITY_CALORIE_RATES.get(activity_type.lower(), 5.0)
    
    # Adjust for user weight (70kg is baseline)
    weight_factor = weight_kg / 70.0
    
    # Calculate total calories
    calories = base_rate * duration_minutes * weight_factor
    
    return round(calories, 2)
