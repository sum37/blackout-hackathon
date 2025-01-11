from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Tree
from fastapi import HTTPException
from datetime import datetime

router = APIRouter(
    prefix="/trees",
    tags=["trees"]
)

def get_season():
    """
    Determine the season based on the current month.

    Returns:
        str: The season ("Spring", "Summer", "Fall", "Winter").
    """
    month = datetime.utcnow().month
    if 3 <= month <= 5:
        return "Spring"
    elif 6 <= month <= 8:
        return "Summer"
    elif 9 <= month <= 11:
        return "Fall"
    else:
        return "Winter"


@router.post("/")
def create_tree(owner_id: int, tree_type: str = "cherryblossom", db: Session = Depends(get_db)):
    """
    Create a tree for a user with a specific type.

    Args:
        owner_id (int): ID of the tree owner.
        tree_type (str): Type of the tree (e.g., cherryblossom, pine, maple, bamboo).
        db (Session): Database session dependency.

    Returns:
        Tree: The created tree record.
    """
    tree = Tree(owner_id=owner_id, tree_type=tree_type)
    db.add(tree)
    db.commit()
    db.refresh(tree)
    return tree


@router.get("/{tree_id}")
def get_tree(tree_id: int, db: Session = Depends(get_db)):
    """
    Get details of a specific tree.

    Args:
        tree_id (int): ID of the tree.
        db (Session): Database session dependency.

    Returns:
        Tree: The tree record.
    """
    tree = db.query(Tree).filter(Tree.id == tree_id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    return tree

@router.get("/user/{owner_id}")
def get_trees_by_user(owner_id: int, db: Session = Depends(get_db)):
    """
    Get all trees owned by a specific user.

    Args:
        owner_id (int): ID of the tree owner.
        db (Session): Database session dependency.

    Returns:
        List[Tree]: A list of all trees owned by the user.
    """
    trees = db.query(Tree).filter(Tree.owner_id == owner_id).all()
    return trees