from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ParkingSpace

router = APIRouter(
    prefix="/parking_spaces",
    tags=["parking_spaces"]
)

@router.post("/")
def create_parking_space(
    x: float,  # Center X-coordinate
    y: float,  # Center Y-coordinate
    width: float,
    height: float,
    db: Session = Depends(get_db)
):
    """
    Create a parking space with its type, center coordinates, and dimensions.

    Args:
        parking_type (str): The type of the parking space (e.g., 'compact', 'large').
        x, y (float): Center coordinates of the parking space.
        width (float): Width of the parking space.
        height (float): Height of the parking space.
        db (Session): Database session dependency.

    Returns:
        ParkingSpace: The created parking space record.
    """
    parking_space = ParkingSpace(
        center_x=x,
        center_y=y,
        width=width,
        height=height
    )
    db.add(parking_space)
    db.commit()
    db.refresh(parking_space)
    return parking_space

@router.get("/")
def get_all_parking_spaces(db: Session = Depends(get_db)):
    """
    Get all parking spaces.

    Args:
        db (Session): Database session dependency.

    Returns:
        List[ParkingSpace]: A list of all parking spaces.
    """
    parking_spaces = db.query(ParkingSpace).all()
    return parking_spaces
