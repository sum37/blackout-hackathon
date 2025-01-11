from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Driving, ParkingSpace, Tree

router = APIRouter(
    prefix="/driving",
    tags=["driving"]
)

@router.post("/")
def start_driving(driver_id: int, db: Session = Depends(get_db)):
    # Check for active driving session
    active_drive = db.query(Driving).filter(
        Driving.driver_id == driver_id,
        Driving.progress == "in_progress"
    ).first()
    if active_drive:
        raise HTTPException(status_code=400, detail="An active driving session already exists.")

    # Start a new driving session
    drive = Driving(driver_id=driver_id, progress="in_progress")
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

    if parking_space:
        # Get the parking space's tree type
        tree_type = parking_space.parking_type

        # Check if the user already has a tree of this type
        tree = db.query(Tree).filter(
            Tree.owner_id == user_id,
            Tree.tree_type == tree_type
        ).first()

        if tree:
            # Increment the tree's experience
            tree.exp += drive.nutrient_success
        else:
            # Create a new tree with the nutrient success experience
            tree = Tree(owner_id=user_id, tree_type=tree_type, exp=drive.nutrient_success)
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
        "parking_space": parking_space.parking_type if parking_space else "No parking space",
        "tree_exp_updated": drive.nutrient_success if parking_space else 0
    }

@router.get("/")
def get_all_driving_sessions(db: Session = Depends(get_db)):
    # Fetch all driving sessions
    drives = db.query(Driving).all()
    return drives

@router.get("/user/{driver_id}")
def get_user_driving_sessions(driver_id: int, db: Session = Depends(get_db)):
    # Fetch all driving sessions for a specific user
    drives = db.query(Driving).filter(Driving.driver_id == driver_id).all()
    return drives
