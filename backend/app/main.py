"""
Main FastAPI application entry point.
Configures the app, middleware, and routes with MongoDB Atlas.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, user, food, activity, goals, dashboard, trainers, payments
import os

# Create FastAPI app instance
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI-powered fitness and food tracking application with MongoDB Atlas"
)

# Configure CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (for uploaded images)
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(food.router)
app.include_router(activity.router)
app.include_router(goals.router)
app.include_router(dashboard.router)
app.include_router(trainers.router)
app.include_router(payments.router)

# Startup event - Connect to MongoDB
@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB Atlas on application startup"""
    await connect_to_mongo()
    print(f"✅ {settings.APP_NAME} v{settings.VERSION} is running")

# Shutdown event - Close MongoDB connection
@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on application shutdown"""
    await close_mongo_connection()

# Root endpoint
@app.get("/")
def root():
    """Root endpoint - API health check"""
    return {
        "message": "AI Fitness & Food Tracking API",
        "version": settings.VERSION,
        "database": "MongoDB Atlas",
        "status": "running"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint for deployment monitoring"""
    return {"status": "healthy", "database": "MongoDB Atlas"}
