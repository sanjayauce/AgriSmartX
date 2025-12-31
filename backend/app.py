from flask import Flask, request, jsonify
from flask_cors import CORS
from trends import CropTrends
import os
import sys
from models import db, ResourceProvider, Product, Review, User, Message
import json
from sqlalchemy import func
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io
import base64
from cnn_model import CNN

# Add the current directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///agrihelp.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# CORS configuration
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000","http://localhost:3003","http://localhost:3002",
            "https://devulapellykushalhig.vercel.app"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

# Construct the absolute path to the data file
backend_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(backend_dir, 'TG_AP_CropData.csv')

# Load the data once on startup
trends_analyzer = CropTrends(data_path)

# Load the PyTorch model and classes once on startup
model = None
class_names = None

def load_crop_health_model():
    """Load the PyTorch model and class names for crop health prediction"""
    global model, class_names
    try:
        # Load class names
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        classes_path = os.path.join(backend_dir, 'classes.json')
        model_path = os.path.join(backend_dir, 'plantvillage_deepcnn_fullmodel.pt')

        with open(classes_path, 'r') as f:
            class_names = json.load(f)
        
        # Load the model
        model_instance = torch.load(model_path, map_location=torch.device('cpu'))
        model_instance.eval()
        model = model_instance
        
        print("✅ Crop health model loaded successfully")
        print(f"📊 Number of classes: {len(class_names)}")
        
    except Exception as e:
        print(f"❌ Error loading crop health model: {str(e)}")
        model = None
        class_names = None

# Load the model on startup
load_crop_health_model()

# Create database tables
with app.app_context():
    db.create_all()

# Resource Provider Routes
@app.route('/api/resource-providers', methods=['GET'])
def get_resource_providers():
    try:
        category = request.args.get('category')
        state = request.args.get('state')
        district = request.args.get('district')

        query = ResourceProvider.query

        if category:
            query = query.filter(ResourceProvider.category == category)
        if state:
            query = query.filter(ResourceProvider.state == state)
        if district:
            query = query.filter(ResourceProvider.district == district)

        providers = query.all()
        return jsonify({
            'providers': [provider.to_dict() for provider in providers]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/resource-providers/<int:provider_id>', methods=['GET'])
def get_resource_provider(provider_id):
    try:
        provider = ResourceProvider.query.get_or_404(provider_id)
        return jsonify(provider.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/resource-providers', methods=['POST'])
def create_resource_provider():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Create new provider
        provider = ResourceProvider(
            name=data['name'],
            category=data['category'],
            subcategory=data.get('subcategory'),
            description=data.get('description'),
            website=data.get('website'),
            logo_url=data.get('logo_url'),
            contact_email=data.get('contact_email'),
            contact_phone=data.get('contact_phone'),
            address=data.get('address'),
            state=data.get('state'),
            district=data.get('district'),
            services=json.dumps(data.get('services', [])) if data.get('services') else None,
            certifications=json.dumps(data.get('certifications', [])) if data.get('certifications') else None
        )

        db.session.add(provider)
        db.session.commit()

        return jsonify(provider.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/resource-providers/<int:provider_id>', methods=['PUT'])
def update_resource_provider(provider_id):
    try:
        provider = ResourceProvider.query.get_or_404(provider_id)
        data = request.get_json()

        # Update fields
        for field in ['name', 'category', 'subcategory', 'description', 'website', 
                     'logo_url', 'contact_email', 'contact_phone', 'address', 
                     'state', 'district']:
            if field in data:
                setattr(provider, field, data[field])

        if 'services' in data:
            provider.services = json.dumps(data['services'])
        if 'certifications' in data:
            provider.certifications = json.dumps(data['certifications'])

        db.session.commit()
        return jsonify(provider.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/resource-providers/<int:provider_id>', methods=['DELETE'])
def delete_resource_provider(provider_id):
    try:
        provider = ResourceProvider.query.get_or_404(provider_id)
        db.session.delete(provider)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

# Product Routes
@app.route('/api/resource-providers/<int:provider_id>/products', methods=['GET'])
def get_provider_products(provider_id):
    try:
        products = Product.query.filter_by(provider_id=provider_id).all()
        return jsonify({
            'products': [product.to_dict() for product in products]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/resource-providers/<int:provider_id>/products', methods=['POST'])
def create_product(provider_id):
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        product = Product(
            provider_id=provider_id,
            name=data['name'],
            category=data['category'],
            description=data.get('description'),
            price=data.get('price'),
            unit=data.get('unit'),
            specifications=json.dumps(data.get('specifications', {})) if data.get('specifications') else None,
            availability=data.get('availability', True)
        )

        db.session.add(product)
        db.session.commit()

        return jsonify(product.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

# Review Routes
@app.route('/api/resource-providers/<int:provider_id>/reviews', methods=['GET'])
def get_provider_reviews(provider_id):
    try:
        reviews = Review.query.filter_by(provider_id=provider_id).all()
        return jsonify({
            'reviews': [review.to_dict() for review in reviews]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/resource-providers/<int:provider_id>/reviews', methods=['POST'])
def create_review(provider_id):
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'rating']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Validate rating
        if not 1 <= data['rating'] <= 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400

        review = Review(
            provider_id=provider_id,
            user_id=data['user_id'],
            rating=data['rating'],
            comment=data.get('comment')
        )

        db.session.add(review)
        db.session.commit()

        return jsonify(review.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

# Existing crop trends route
@app.route('/data', methods=['POST'])
def handle_filters():
    try:
        data = request.get_json()

        crop = data.get('crop')
        state = data.get('state')
        year = data.get('year')

        if not crop:
            return jsonify({'error': 'Crop name is required'}), 400

        trend_data = trends_analyzer.get_crop_trends(crop, state, year)

        if trend_data is None:
            return jsonify({'error': 'No data found for the specified filters'}), 404

        return jsonify({'trends': trend_data}), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

# @app.route('/api/admin/send-message', methods=['POST'])
# def send_admin_message():
#     try:
#         data = request.get_json()
#         subject = data.get('subject')
#         message_content = data.get('message')
#         target_roles = data.get('roles')

#         if not all([subject, message_content, target_roles]):
#             return jsonify({'error': 'Missing required fields'}), 400

#         # Create a new Message instance
#         new_message = Message(
#             subject=subject,
#             content=message_content,
#             recipient_roles=json.dumps(target_roles)
#         )

#         # Add the message to the database session and commit
#         db.session.add(new_message)
#         db.session.commit()

#         # TODO: Add logic here to actually send notifications or messages to users
#         # based on their roles. This might involve another service or background task.

#         # Fetch users belonging to the target roles
#         users_to_message = User.query.filter(User.role.in_(target_roles)).all()

#         # Placeholder for sending logic
#         for user in users_to_message:
#             print(f"Would send message to user: {user.username} ({user.role})")
#             # TODO: Implement actual message sending mechanism (e.g., email, in-app notification)

#         return jsonify({'message': 'Message sent successfully!', 'message_id': new_message.id}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': 'Failed to send message', 'details': str(e)}), 500

# @app.route('/api/messages', methods=['GET'])
# def get_user_messages():
#     try:
#         # In a real application, the user's role would come from authentication
#         # For now, we'll get it from a query parameter for testing
#         user_role = request.args.get('role')

#         if not user_role:
#             return jsonify({'error': 'User role is required'}), 400

#         # Query messages where the user_role is in the recipient_roles JSON array
#         # Using a simpler JSON query approach
#         messages = Message.query.filter(
#             Message.recipient_roles.like(f'%"{user_role}"%')
#         ).all()

#         return jsonify({
#             'messages': [message.to_dict() for message in messages]
#         }), 200

#     except Exception as e:
#         return jsonify({'error': 'Failed to retrieve messages', 'details': str(e)}), 500

# # Crop Health Prediction Route
@app.route('/api/predict_crop_health', methods=['POST'])
def predict_crop_health():
    """
    Predict crop health from uploaded image using PyTorch model
    Accepts: multipart/form-data with 'image' file
    Returns: JSON with predicted class and confidence
    """
    try:
        # Check if model is loaded
        if model is None or class_names is None:
            return jsonify({
                'error': 'Crop health model not loaded. Please try again later.'
            }), 503

        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided. Please upload an image.'
            }), 400

        image_file = request.files['image']
        
        # Validate file
        if image_file.filename == '':
            return jsonify({
                'error': 'No image file selected. Please choose an image.'
            }), 400

        # Check file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
        if not ('.' in image_file.filename and 
                image_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({
                'error': 'Invalid file type. Please upload a valid image file (PNG, JPG, JPEG, GIF, BMP).'
            }), 400

        # Read and preprocess the image
        try:
            # Open image using PIL
            image = Image.open(image_file.stream)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Define the same transforms used during training
            transform = transforms.Compose([
                transforms.Resize((224, 224)),  # Resize to model input size
                transforms.ToTensor(),          # Convert to tensor
                transforms.Normalize(           # Normalize with ImageNet stats
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]
                )
            ])
            
            # Apply transforms
            image_tensor = transform(image)
            image_tensor = image_tensor.unsqueeze(0)  # Add batch dimension
            
        except Exception as e:
            return jsonify({
                'error': f'Error processing image: {str(e)}'
            }), 400

        # Make prediction
        try:
            with torch.no_grad():  # Disable gradient computation for inference
                outputs = model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                predicted_class_idx = torch.argmax(probabilities, dim=1).item()
                confidence = probabilities[0][predicted_class_idx].item()
                
                # Get predicted class name
                predicted_class = class_names[predicted_class_idx]
                
        except Exception as e:
            return jsonify({
                'error': f'Error making prediction: {str(e)}'
            }), 500

        # Format the response
        # Parse the class name to extract crop and disease info
        class_parts = predicted_class.split('___')
        crop_name = class_parts[0] if len(class_parts) > 0 else "Unknown"
        disease_name = class_parts[1] if len(class_parts) > 1 else "Unknown"
        
        # Determine if the plant is healthy
        is_healthy = "healthy" in disease_name.lower()
        
        response = {
            'predicted_class': predicted_class,
            'crop_name': crop_name,
            'disease_name': disease_name,
            'is_healthy': is_healthy,
            'confidence': round(confidence * 100, 2),  # Convert to percentage
            'message': f"The image shows {crop_name} with {disease_name} (Confidence: {confidence * 100:.1f}%)"
        }
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            'error': f'Unexpected error: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
