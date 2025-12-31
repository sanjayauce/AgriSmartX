import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from inference import predict as model_predict
from agents.orchestrator import run_agents as orchestrator_run_agents

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)

# --- API Endpoint Definition ---
@app.route('/predict', methods=['POST'])
async def predict(): # Make the function asynchronous
    """
    Handles the image prediction request using a fully async pipeline.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part provided.'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected.'}), 400

    try:
        class_name, confidence = model_predict(file)
        if class_name is None:
            return jsonify({'error': 'Model prediction failed.'}), 500
    except Exception as e:
        return jsonify({'error': f'Model error: {e}'}), 500

    user_info = {
        "farmer_id": request.form.get("user_id", "user_placeholder_123"),
        "language": request.headers.get("Accept-Language", "en-US")
    }

    try:
        # Await the asynchronous orchestrator directly
        enriched_response = await orchestrator_run_agents(class_name, confidence, user_info)
        return jsonify(enriched_response)
    except Exception as e:
        print(f"❌ Orchestrator error: {e}")
        return jsonify({'error': f'Error processing result: {e}'}), 500

# --- Main Execution ---
if __name__ == '__main__':
    app.run(debug=True, port=5002)

# --- cURL Example for Testing ---
#
# curl -X POST -F "file=@/path/to/your/test_image.jpg" http://127.0.0.1:5002/predict
#
# Replace `/path/to/your/test_image.jpg` with the actual path to a test image.
# For example, if you have an image `apple_scab.jpg` in your Downloads folder:
# curl -X POST -F "file=@~/Downloads/apple_scab.jpg" http://127.0.0.1:5002/predict
#