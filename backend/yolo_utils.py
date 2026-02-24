import os
import cv2

_model = None

def _get_model():
    global _model
    if _model is None:
        from ultralytics import YOLO
        _model = YOLO(os.path.join(os.path.dirname(__file__), "model", "best.pt"))
    return _model

def detect_drug(image_path, output_path):
    model = _get_model()
    results = model(image_path)

    img = cv2.imread(image_path)

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])

            label = f"drug-name {conf:.2f}"

            cv2.rectangle(img, (x1,y1), (x2,y2), (0,255,0), 2)
            cv2.putText(img, label, (x1, y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0), 2)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cv2.imwrite(output_path, img)