import cv2
from ultralytics import YOLO

# Load the trained YOLO model
MODEL_PATH = "models/best.pt"
model = YOLO(MODEL_PATH)

# Initialize webcam
cap = cv2.VideoCapture(0)
cap.set(3, 640)  # Set width
cap.set(4, 480)  # Set height

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # Run YOLO inference
    results = model(frame)

    # Annotate the frame
    annotated_frame = results[0].plot()

    # Display the frame
    cv2.imshow("Helmet Detection", annotated_frame)

    # Exit on 'q' key
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
