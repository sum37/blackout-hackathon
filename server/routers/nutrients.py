from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Nutrient, Driving
from datetime import datetime

router = APIRouter(
    prefix="/nutrients",
    tags=["nutrients"]
)

@router.post("/")
def plant_nutrient(x: float, y: float, planted_by: int, nutrient_type: str, db: Session = Depends(get_db)):
    # Check for active driving session
    active_drive = db.query(Driving).filter(
        Driving.driver_id == planted_by,
        Driving.progress == "in_progress"
    ).first()
    
    if not active_drive:
        raise HTTPException(status_code=400, detail="No active driving session for this user.")

    # Update nutrient_fail or nutrient_success
    if nutrient_type == "broken":
        active_drive.nutrient_fail += 1
    else:
        active_drive.nutrient_success += 1

    db.commit()  # Commit updates to the driving session

    # Add the nutrient record
    nutrient = Nutrient(
        planted_time=datetime.utcnow(),
        planted_x=x,
        planted_y=y,
        planted_by=planted_by,
        nutrient_type=nutrient_type
    )
    db.add(nutrient)
    db.commit()
    db.refresh(nutrient)

    return {
        "message": "Nutrient planted successfully",
        "nutrient": nutrient,
        "active_drive": {
            "nutrient_success": active_drive.nutrient_success,
            "nutrient_fail": active_drive.nutrient_fail,
        },
    }

@router.get("/")
def get_all_nutrients(db: Session = Depends(get_db)):
    nutrients = db.query(Nutrient).all()
    return nutrients
