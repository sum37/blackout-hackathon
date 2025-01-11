from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Tree
from fastapi import HTTPException

router = APIRouter(
    prefix="/trees",
    tags=["trees"]
)

@router.post("/")
def create_tree(owner_id: int, tree_type: str, db: Session = Depends(get_db)):
    tree = Tree(owner_id=owner_id, tree_type=tree_type)
    db.add(tree)
    db.commit()
    db.refresh(tree)
    return tree

@router.get("/{tree_id}")
def get_tree(tree_id: int, db: Session = Depends(get_db)):
    tree = db.query(Tree).filter(Tree.id == tree_id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    return tree

@router.get("/user/{owner_id}")
def get_trees_by_user(owner_id: int, db: Session = Depends(get_db)):
    trees = db.query(Tree).filter(Tree.owner_id == owner_id).all()
    return trees
