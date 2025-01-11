import os
import random
import shutil
from ultralytics import YOLO

# Directories
BASE_DIR = os.getcwd()
INPUT_DIR = os.path.join(BASE_DIR, "datasets", "input")  # Path to the dataset
WORKING_DIR = os.path.join(BASE_DIR, "datasets", "processed")  # Processed dataset
LABELS_DIR = os.path.join(WORKING_DIR, "labels")
TRAIN_IMG_DIR = os.path.join(WORKING_DIR, "train", "images")
TRAIN_LABELS_DIR = os.path.join(WORKING_DIR, "train", "labels")
VAL_IMG_DIR = os.path.join(WORKING_DIR, "val", "images")
VAL_LABELS_DIR = os.path.join(WORKING_DIR, "val", "labels")
MODEL_DIR = os.path.join(BASE_DIR, "models")
CONFIG_PATH = os.path.join(BASE_DIR, "config.yaml")

os.makedirs(MODEL_DIR, exist_ok=True)

# Parse XML files for annotations
def parse_xml(xml_file):
    import xml.etree.ElementTree as ET
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Extract image information
    image_name = root.find("filename").text
    width = int(root.find("size/width").text)
    height = int(root.find("size/height").text)

    labels_and_bboxes = []
    for obj in root.findall("object"):
        label = obj.find("name").text
        xmin = int(obj.find("bndbox/xmin").text)
        ymin = int(obj.find("bndbox/ymin").text)
        xmax = int(obj.find("bndbox/xmax").text)
        ymax = int(obj.find("bndbox/ymax").text)
        labels_and_bboxes.append((label, (xmin, ymin, xmax, ymax)))

    return image_name, (width, height), labels_and_bboxes

# Create YOLO labels
def create_labels(input_dir, labels_dir):
    os.makedirs(labels_dir, exist_ok=True)
    annotations_dir = os.path.join(input_dir, "annotations")
    for xml_file in os.listdir(annotations_dir):
        if not xml_file.endswith(".xml"):
            continue

        image_name, (width, height), labels_and_bboxes = parse_xml(os.path.join(annotations_dir, xml_file))
        txt_file = os.path.join(labels_dir, xml_file.replace(".xml", ".txt"))

        with open(txt_file, "w") as f:
            for label, bbox in labels_and_bboxes:
                class_id = 1 if label.lower() == "with helmet" else 0
                x_center = (bbox[0] + bbox[2]) / 2 / width
                y_center = (bbox[1] + bbox[3]) / 2 / height
                box_width = (bbox[2] - bbox[0]) / width
                box_height = (bbox[3] - bbox[1]) / height
                f.write(f"{class_id} {x_center} {y_center} {box_width} {box_height}\n")

# Split dataset
def create_train_val_split():
    os.makedirs(TRAIN_IMG_DIR, exist_ok=True)
    os.makedirs(VAL_IMG_DIR, exist_ok=True)
    os.makedirs(TRAIN_LABELS_DIR, exist_ok=True)
    os.makedirs(VAL_LABELS_DIR, exist_ok=True)

    images_dir = os.path.join(INPUT_DIR, "images")
    images = [img for img in os.listdir(images_dir) if img.endswith(".png")]
    random.shuffle(images)
    split_idx = int(0.8 * len(images))

    for idx, img in enumerate(images):
        label_file = img.replace(".png", ".txt")
        if idx < split_idx:
            shutil.copy(os.path.join(images_dir, img), TRAIN_IMG_DIR)
            shutil.copy(os.path.join(LABELS_DIR, label_file), TRAIN_LABELS_DIR)
        else:
            shutil.copy(os.path.join(images_dir, img), VAL_IMG_DIR)
            shutil.copy(os.path.join(LABELS_DIR, label_file), VAL_LABELS_DIR)

# Create YOLO config file
def create_config():
    config_content = f"""path: {WORKING_DIR}
train: train/images
val: val/images
names:
  0: without helmet
  1: with helmet
"""
    with open(CONFIG_PATH, "w") as f:
        f.write(config_content)

# Train YOLOv8
def train_model():
    yolo = YOLO("yolov8n.pt")
    yolo.train(
        data=CONFIG_PATH,
        epochs=10,
        patience=10,
        batch=-1,
        save_period=10,
        dropout=0.1,
        plots=True,
    )

if __name__ == "__main__":
    os.makedirs(LABELS_DIR, exist_ok=True)
    create_labels(INPUT_DIR, LABELS_DIR)
    create_train_val_split()
    create_config()
    train_model()
