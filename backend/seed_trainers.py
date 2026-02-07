"""
Seed database with sample trainers for testing
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

sample_trainers = [
    {
        "name": "Alex Rodriguez",
        "email": "alex.rodriguez@fitness.com",
        "specialization": "Weight Loss",
        "bio": "Experienced weight loss specialist with 8+ years helping clients achieve their fitness goals. Certified nutritionist and personal trainer.",
        "hourly_rate": 50,
        "experience_years": 8,
        "certifications": ["ACE Certified Personal Trainer", "Certified Nutrition Specialist", "CPR/AED Certified"],
        "is_verified": True,
        "rating": 4.8,
        "total_reviews": 45,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@fitness.com",
        "specialization": "Muscle Gain",
        "bio": "Bodybuilding coach and strength training expert. Helped 100+ clients build muscle and increase strength.",
        "hourly_rate": 60,
        "experience_years": 10,
        "certifications": ["NASM Certified", "Strength & Conditioning Specialist", "Sports Nutrition Certified"],
        "is_verified": True,
        "rating": 4.9,
        "total_reviews": 67,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Maya Patel",
        "email": "maya.patel@fitness.com",
        "specialization": "Yoga",
        "bio": "Certified yoga instructor specializing in Vinyasa and Hatha yoga. 6 years of teaching experience.",
        "hourly_rate": 45,
        "experience_years": 6,
        "certifications": ["200-Hour Yoga Teacher Training", "Meditation Instructor", "Prenatal Yoga Certified"],
        "is_verified": True,
        "rating": 4.7,
        "total_reviews": 38,
        "created_at": datetime.utcnow()
    },
    {
        "name": "David Chen",
        "email": "david.chen@fitness.com",
        "specialization": "Cardio & Endurance",
        "bio": "Marathon runner and endurance coach. Specialized in improving cardiovascular fitness and stamina.",
        "hourly_rate": 55,
        "experience_years": 7,
        "certifications": ["RRCA Running Coach", "Endurance Training Specialist", "CPR Certified"],
        "is_verified": True,
        "rating": 4.6,
        "total_reviews": 29,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Jessica Williams",
        "email": "jessica.williams@fitness.com",
        "specialization": "HIIT & Functional Training",
        "bio": "High-intensity interval training expert. Focus on functional movements and metabolic conditioning.",
        "hourly_rate": 65,
        "experience_years": 9,
        "certifications": ["CrossFit Level 2 Trainer", "Functional Movement Specialist", "TRX Certified"],
        "is_verified": True,
        "rating": 4.9,
        "total_reviews": 52,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Michael Brown",
        "email": "michael.brown@fitness.com",
        "specialization": "Weight Loss",
        "bio": "Former athlete turned fitness coach. Specializing in sustainable weight loss and lifestyle changes.",
        "hourly_rate": 50,
        "experience_years": 5,
        "certifications": ["NASM Certified", "Behavior Change Specialist", "Nutrition Coach"],
        "is_verified": True,
        "rating": 4.5,
        "total_reviews": 31,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Emma Thompson",
        "email": "emma.thompson@fitness.com",
        "specialization": "Muscle Gain",
        "bio": "Powerlifting coach with expertise in hypertrophy training and muscle building programs.",
        "hourly_rate": 60,
        "experience_years": 11,
        "certifications": ["NSCA-CPT", "USA Powerlifting Coach", "Sports Performance Specialist"],
        "is_verified": True,
        "rating": 4.8,
        "total_reviews": 58,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Raj Kumar",
        "email": "raj.kumar@fitness.com",
        "specialization": "Yoga",
        "bio": "Traditional yoga practitioner with modern approach. Specializing in flexibility and mindfulness.",
        "hourly_rate": 45,
        "experience_years": 12,
        "certifications": ["500-Hour Yoga Alliance", "Ayurveda Wellness Counselor", "Meditation Master"],
        "is_verified": True,
        "rating": 4.9,
        "total_reviews": 73,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Lisa Anderson",
        "email": "lisa.anderson@fitness.com",
        "specialization": "Cardio & Endurance",
        "bio": "Triathlon coach and cycling specialist. Helping athletes improve endurance and race performance.",
        "hourly_rate": 55,
        "experience_years": 8,
        "certifications": ["USA Triathlon Coach", "Cycling Coach", "Endurance Nutrition Specialist"],
        "is_verified": True,
        "rating": 4.7,
        "total_reviews": 41,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Chris Martinez",
        "email": "chris.martinez@fitness.com",
        "specialization": "HIIT & Functional Training",
        "bio": "Military fitness expert specializing in functional training and tactical conditioning.",
        "hourly_rate": 65,
        "experience_years": 10,
        "certifications": ["Tactical Strength & Conditioning", "Kettlebell Instructor", "Mobility Specialist"],
        "is_verified": True,
        "rating": 4.8,
        "total_reviews": 49,
        "created_at": datetime.utcnow()
    }
]

async def seed_trainers():
    """Seed database with sample trainers"""
    client = AsyncIOMotorClient(MONGO_URI)
    db = client.fitness_db
    
    # Clear existing trainers
    await db.trainers.delete_many({})
    print("Cleared existing trainers")
    
    # Insert sample trainers
    result = await db.trainers.insert_many(sample_trainers)
    print(f"Inserted {len(result.inserted_ids)} trainers")
    
    # Display inserted trainers
    for trainer in sample_trainers:
        print(f"- {trainer['name']} ({trainer['specialization']}) - ₹{trainer['hourly_rate']}/hr - Rating: {trainer['rating']}")
    
    client.close()
    print("\nDatabase seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_trainers())
