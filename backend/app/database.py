"""
Database configuration for MongoDB Atlas.
Uses Motor (async MongoDB driver) for FastAPI.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# MongoDB client
client = None
database = None

async def connect_to_mongo():
    """Connect to MongoDB Atlas on application startup"""
    global client, database
    try:
        import ssl
        import certifi
        
        # Create SSL context for Windows compatibility
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        client = AsyncIOMotorClient(
            settings.DATABASE_URL,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=20000,
            socketTimeoutMS=20000,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=True,
            tlsAllowInvalidHostnames=True
        )
        # Test connection
        await client.admin.command('ping')
        database = client.fitness_app
        print("✅ Connected to MongoDB Atlas")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("⚠️ Continuing without MongoDB - using mock data")
        # Create a mock database object to prevent None errors
        database = type('MockDB', (), {})()
        database.trainers = type('MockCollection', (), {
            'find': lambda *args, **kwargs: type('MockCursor', (), {
                'sort': lambda *args, **kwargs: type('MockCursor', (), {
                    'limit': lambda *args, **kwargs: type('MockCursor', (), {
                        'to_list': lambda *args, **kwargs: []
                    })()
                })()
            })(),
            'find_one': lambda *args, **kwargs: None,
            'insert_one': lambda *args, **kwargs: None,
            'insert_many': lambda *args, **kwargs: None
        })()

async def close_mongo_connection():
    """Close MongoDB connection on application shutdown"""
    global client
    if client:
        client.close()
        print("✅ Closed MongoDB connection")

def get_database():
    """Get database instance"""
    return database

def get_db():
    """
    Dependency function to get database.
    For MongoDB, this returns the database instance directly.
    """
    return database
