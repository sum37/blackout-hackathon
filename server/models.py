from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    trees = relationship("Tree", back_populates="owner")

class Tree(Base):
    __tablename__ = "trees"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    exp = Column(Float, default=0)
    tree_type = Column(String)
    owner = relationship("User", back_populates="trees")

class Nutrient(Base):
    __tablename__ = "nutrients"
    id = Column(Integer, primary_key=True, index=True)
    planted_time = Column(DateTime)
    planted_x = Column(Float)
    planted_y = Column(Float)
    planted_by = Column(Integer, ForeignKey("users.id"))
    nutrient_type = Column(String)  # Dead or Alive

class ParkingSpace(Base):
    __tablename__ = "parking_spaces"
    id = Column(Integer, primary_key=True, index=True)
    parking_type = Column(String, index=True)
    center_x = Column(Float)  # Center X-coordinate
    center_y = Column(Float)  # Center Y-coordinate
    width = Column(Float)     # Width of the parking space
    height = Column(Float)    # Height of the parking space

class Driving(Base):
    __tablename__ = "driving"
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"))
    progress = Column(String, default="in_progress")
    nutrient_success = Column(Integer, default=0)  # Count of nutrients that are not broken
    nutrient_fail = Column(Integer, default=0)     # Count of nutrients that are broken
