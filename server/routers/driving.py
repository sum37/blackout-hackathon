from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Driving, ParkingSpace, Tree
from datetime import datetime
from random import choice

router = APIRouter(
    prefix="/driving",
    tags=["driving"]
)

@router.post("/")
def start_driving(driver_id: int, db: Session = Depends(get_db)):
    """
    Start a new driving session for the user.

    Args:
        driver_id (int): ID of the user starting the drive.
        db (Session): Database session dependency.

    Returns:
        Driving: The started driving session.
    """
    # Check for active driving session
    active_drive = db.query(Driving).filter(
        Driving.driver_id == driver_id,
        Driving.progress == "in_progress"
    ).first()
    if active_drive:
        raise HTTPException(status_code=400, detail="An active driving session already exists.")

    # Assign a random tree type
    tree_type = choice(["cherryblossom", "pine", "maple", "bamboo"])

    # Start a new driving session
    drive = Driving(driver_id=driver_id, progress="in_progress", tree_type=tree_type)
    db.add(drive)
    db.commit()
    db.refresh(drive)
    return drive


@router.patch("/end")
def end_driving(
    user_id: int,
    x: float,
    y: float,
    db: Session = Depends(get_db)
):
    """
    End the current active driving session for the given user.

    Args:
        user_id (int): ID of the user ending the drive.
        x, y (float): Final parking location coordinates.
        db (Session): Database session dependency.

    Returns:
        dict: Information about the ended drive and updated tree experience.
    """
    # Find the active driving session for the user
    drive = db.query(Driving).filter(
        Driving.driver_id == user_id,
        Driving.progress == "in_progress"
    ).first()
    
    if not drive:
        raise HTTPException(status_code=404, detail="Active driving session not found for this user.")

    # End the driving session
    drive.progress = "finished"
    db.commit()

    # Check if the location (x, y) is inside any parking space
    parking_space = db.query(ParkingSpace).filter(
        (x >= ParkingSpace.center_x - ParkingSpace.width / 2) &
        (x <= ParkingSpace.center_x + ParkingSpace.width / 2) &
        (y >= ParkingSpace.center_y - ParkingSpace.height / 2) &
        (y <= ParkingSpace.center_y + ParkingSpace.height / 2)
    ).first()

    tree_exp_updated = 0
    tree_type = drive.tree_type  # Use the tree type assigned to the active drive

    # Handle cases based on parking space presence and nutrient success
    if parking_space:
        # Parking space is valid
        if drive.nutrient_success > 0:
            tree_exp_updated = drive.nutrient_success + 100
        else:
            tree_exp_updated = 50  # No nutrients planted, flat bonus
    elif drive.nutrient_success > 0:
        # No parking space but nutrient_success > 0
        tree_exp_updated = drive.nutrient_success / 2

    # Check if a tree of this type exists
    tree = db.query(Tree).filter(
        Tree.owner_id == user_id,
        Tree.tree_type == tree_type
    ).first()

    if tree:
        # Update existing tree's experience
        tree.exp += tree_exp_updated
    else:
        # Create a new tree regardless of tree_exp_updated
        tree = Tree(owner_id=user_id, tree_type=tree_type, exp=tree_exp_updated)
        db.add(tree)

    db.commit()

    return {
        "message": "Driving session ended successfully.",
        "drive": {
            "id": drive.id,
            "driver_id": drive.driver_id,
            "nutrient_success": drive.nutrient_success,
            "nutrient_fail": drive.nutrient_fail,
            "progress": drive.progress
        },
        "parking_space": "Valid parking space" if parking_space else "No parking space",
        "tree_exp_updated": tree_exp_updated
    }


@router.get("/")
def get_all_driving_sessions(db: Session = Depends(get_db)):
    """
    Get all driving sessions.

    Args:
        db (Session): Database session dependency.

    Returns:
        List[Driving]: A list of all driving sessions.
    """
    drives = db.query(Driving).all()
    return drives

@router.get("/user/{driver_id}")
def get_user_driving_sessions(driver_id: int, db: Session = Depends(get_db)):
    """
    Get all driving sessions for a specific user.

    Args:
        driver_id (int): ID of the user.
        db (Session): Database session dependency.

    Returns:
        List[Driving]: A list of all driving sessions for the user.
    """
    drives = db.query(Driving).filter(Driving.driver_id == driver_id).all()
    return drives
