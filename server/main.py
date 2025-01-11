from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine
from models import Base
from routers import users, nutrients, trees, driving, parking_spaces, helmet_detection

app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace "*" with specific origins for better security
    allow_credentials=True,
    allow_methods=["*"],  # Or specify allowed methods, e.g., ["GET", "POST"]
    allow_headers=["*"],  # Or specify allowed headers, e.g., ["Authorization", "Content-Type"]
)
app.mount("/static", StaticFiles(directory="static"), name="static")
# Create all database tables
Base.metadata.create_all(bind=engine)

# Include routers for different endpoints
app.include_router(users.router)
app.include_router(nutrients.router)
app.include_router(trees.router)
app.include_router(driving.router)
app.include_router(parking_spaces.router)
app.include_router(helmet_detection.router)
