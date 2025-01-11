from fastapi import FastAPI
from database import engine
from models import Base
from routers import users, nutrients, trees, driving, parking_spaces, helmet_detection

app = FastAPI()

# Create all database tables
Base.metadata.create_all(bind=engine)

# Include routers for different endpoints
app.include_router(users.router)
app.include_router(nutrients.router)
app.include_router(trees.router)
app.include_router(driving.router)
app.include_router(parking_spaces.router)
app.include_router(helmet_detection.router)