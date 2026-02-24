from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
# ...existing code...
# remove top-level: from yolo_utils import detect_drug

app = Flask(__name__, static_folder="static")
CORS(app)

UPLOAD = os.path.join(app.root_path, "static", "input.jpg")
OUTPUT = os.path.join(app.root_path, "static", "output.jpg")

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "no image uploaded"}), 400

    file = request.files["image"]
    try:
        file.save(UPLOAD)
    except Exception as e:
        return jsonify({"error": f"save failed: {e}"}), 500

    try:
        # defer model import to runtime to avoid import-time crashes
        from yolo_utils import detect_drug
    except Exception as e:
        return jsonify({"error": f"import yolo_utils failed: {e}"}), 500

    try:
        detect_drug(UPLOAD, OUTPUT)
    except Exception as e:
        return jsonify({"error": f"detection failed: {e}"}), 500

    if not os.path.exists(OUTPUT):
        return jsonify({"error": "output not created"}), 500

    return send_file(OUTPUT, mimetype="image/jpeg")

@app.route("/ping")
def ping():
    return "pong", 200

if __name__ == "__main__":
    app.run(debug=False, host="127.0.0.1", port=5000)