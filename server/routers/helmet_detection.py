from fastapi import APIRouter, UploadFile, File, HTTPException
from ultralytics import YOLO
from PIL import Image
import os
from io import BytesIO

router = APIRouter(
    prefix="/helmet_detection",
    tags=["helmet_detection"]
)

MODEL_PATH = "models/best.pt"  # Path to your trained model
OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load the YOLO model
try:
    model = YOLO(MODEL_PATH)
except FileNotFoundError:
    raise HTTPException(status_code=500, detail="Model file not found. Train the model first.")

@router.post("/predict/")
async def predict_helmet(file: UploadFile = File(...)):
    """
    Predict helmet detection for an uploaded image.

    Args:
        file (UploadFile): Image file.

    Returns:
        dict: Detection results.
    """
    try:
        contents = await file.read()
        
        img = Image.open(BytesIO(contents))

        # Run YOLO inference
        results = model.predict(source=img, save=True, save_dir=OUTPUT_DIR)

        predictions = []
        for box in results[0].boxes.data.tolist():
            x1, y1, x2, y2, conf, cls = box
            predictions.append({
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
                "confidence": conf,
                "class": int(cls)
            })

        return {"predictions": predictions, "output_dir": OUTPUT_DIR}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
