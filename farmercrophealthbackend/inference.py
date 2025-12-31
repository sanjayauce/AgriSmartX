# model/inference.py

import torch
import json
from torchvision import transforms
from PIL import Image
import os

# Define the path to the model and classes files
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "plantvillage_weights_v22.pt")
CLASSES_PATH = os.path.join(MODEL_DIR, "classes.json")

# --- Model Definition ---
class CNN(torch.nn.Module):
    """A Convolutional Neural Network for image classification."""
    def __init__(self, num_classes):
        super(CNN, self).__init__()
        # Convolutional layers
        self.conv_layers = torch.nn.Sequential(
            torch.nn.Conv2d(3, 32, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(32),
            torch.nn.Conv2d(32, 32, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(32),
            torch.nn.MaxPool2d(2),
            torch.nn.Conv2d(32, 64, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(64),
            torch.nn.Conv2d(64, 64, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(64),
            torch.nn.MaxPool2d(2),
            torch.nn.Conv2d(64, 128, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(128),
            torch.nn.Conv2d(128, 128, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(128),
            torch.nn.MaxPool2d(2),
            torch.nn.Conv2d(128, 256, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(256),
            torch.nn.Conv2d(256, 256, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(256),
            torch.nn.MaxPool2d(2),
            torch.nn.Conv2d(256, 256, 3, 1, 1), torch.nn.ReLU(), torch.nn.BatchNorm2d(256)
        )
        self.avgpool = torch.nn.AdaptiveAvgPool2d((7, 7))
        # Dense (fully connected) layers
        self.dense_layers = torch.nn.Sequential(
            torch.nn.Dropout(0.4),
            torch.nn.Linear(256 * 7 * 7, 1024),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.4),
            torch.nn.Linear(1024, num_classes)
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.dense_layers(x)
        return x

# --- Model Loading ---
def load_model():
    """Load the CNN model and class names."""
    try:
        with open(CLASSES_PATH) as f:
            class_names = json.load(f)
        
        model = CNN(num_classes=len(class_names))
        
        # Load the model weights, ensuring it runs on the CPU
        model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
        model.eval() # Set the model to evaluation mode
        
        print("✅ Model and class names loaded successfully.")
        return model, class_names
        
    except FileNotFoundError as e:
        print(f"❌ Error loading model files: {e}. Make sure '{os.path.basename(MODEL_PATH)}' and '{os.path.basename(CLASSES_PATH)}' are in the '{MODEL_DIR}' directory.")
        return None, None
    except Exception as e:
        print(f"❌ An unexpected error occurred during model loading: {e}")
        return None, None

# Load the model and classes at import time
model, class_names = load_model()

# --- Image Transformation ---
def transform_image(image_bytes):
    """Apply transformations to the input image to prepare it for the model."""
    # Define the sequence of transformations
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            [0.485, 0.456, 0.406], # Mean for normalization
            [0.229, 0.224, 0.225]  # Standard deviation for normalization
        )
    ])
    # Open the image from bytes, convert to RGB, and apply transformations
    image = Image.open(image_bytes).convert("RGB")
    return transform(image).unsqueeze(0) # Add a batch dimension

# --- Prediction Function ---
def predict(image_bytes):
    """
    Run inference on the preprocessed image and return the predicted class and confidence score.
    """
    if not model or not class_names:
        raise RuntimeError("Model is not loaded. Cannot perform prediction.")

    try:
        # Transform the image and get model output
        image_tensor = transform_image(image_bytes)
        
        with torch.no_grad(): # Disable gradient calculation for inference
            output = model(image_tensor)
            
            # Get the index of the highest-scoring class
            _, predicted_class_index = torch.max(output, 1)
            
            # Calculate probabilities using softmax
            probabilities = torch.nn.functional.softmax(output, dim=1)
            
            # Get the confidence score for the predicted class
            confidence = probabilities[0, predicted_class_index.item()].item() * 100
            
            # Get the name of the predicted class
            predicted_class_name = class_names[predicted_class_index.item()]
            
        return predicted_class_name, f"{confidence:.2f}%"

    except Exception as e:
        print(f"❌ An error occurred during prediction: {e}")
        return None, None 