# 🌾 Crop Health Feature - AgriHelp

## Overview
The Crop Health feature allows farmers to upload images of their crops and get instant disease predictions using a deep learning model. This feature helps farmers identify plant diseases early and take appropriate action.

## 🚀 Features

### ✅ Backend (Flask)
- **Model Loading**: PyTorch model loaded once on startup for efficiency
- **Image Processing**: PIL-based image preprocessing with torchvision transforms
- **API Endpoint**: `/api/predict_crop_health` POST route
- **Error Handling**: Comprehensive error handling for various scenarios
- **File Validation**: File type and size validation

### ✅ Frontend (React)
- **Image Upload**: Drag-and-drop or click-to-upload interface
- **Image Preview**: Real-time preview of uploaded images
- **Results Display**: Beautiful, informative results with confidence scores
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Clear error messages for users

## 📁 File Structure

```
AgriHelp/
├── backend/
│   ├── app.py                    # Flask backend with crop health route
│   ├── classes.json             # Class labels for crop health model
│   ├── plantvillage_deepcnn_fullmodel.pt  # Crop health PyTorch model file
│   ├── test_crop_health.py       # Test script for API
│   └── requirements.txt          # Updated with PyTorch dependencies
├── src/
│   ├── components/
│   │   └── FarmerSidebar.jsx     # Updated with Crop Health link
│   ├── pages/
│   │   ├── CropHealth.jsx        # Main crop health component
│   │   └── CropHealth.css        # Styling for crop health page
│   └── App.jsx                   # Updated with crop health route
└── CROP_HEALTH_README.md        # This file
```

## 🛠️ Installation & Setup

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

### 2. Frontend Setup
```bash
# Install dependencies (if not already done)
npm install

# Start the React development server
npm start
```

### 3. Model Files
Ensure these files are in the root directory:
- `plantvillage_deepcnn_fullmodel.pt` (PyTorch model)
- `classes.json` (Class labels)

## 🔧 API Documentation

### POST `/api/predict_crop_health`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` file (JPG, PNG, GIF, BMP, max 5MB)

**Response:**
```json
{
  "predicted_class": "Tomato___healthy",
  "crop_name": "Tomato",
  "disease_name": "healthy",
  "is_healthy": true,
  "confidence": 95.67,
  "message": "The image shows Tomato with healthy (Confidence: 95.7%)"
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

## 🎯 Supported Crops & Diseases

The model supports 38 different classes including:

### Fruits
- Apple (Apple scab, Black rot, Cedar apple rust, Healthy)
- Blueberry (Healthy)
- Cherry (Powdery mildew, Healthy)
- Grape (Black rot, Esca, Leaf blight, Healthy)
- Orange (Haunglongbing)
- Peach (Bacterial spot, Healthy)
- Raspberry (Healthy)
- Strawberry (Leaf scorch, Healthy)

### Vegetables
- Bell Pepper (Bacterial spot, Healthy)
- Potato (Early blight, Late blight, Healthy)
- Squash (Powdery mildew)
- Tomato (Bacterial spot, Early blight, Late blight, Leaf Mold, Septoria leaf spot, Spider mites, Target Spot, Yellow Leaf Curl Virus, Mosaic virus, Healthy)

### Grains
- Corn/Maize (Cercospora leaf spot, Common rust, Northern Leaf Blight, Healthy)
- Soybean (Healthy)

## 🧪 Testing

### 1. API Testing
```bash
# Run the test script
python test_crop_health.py

# Test with curl
curl -X POST -F 'image=@path/to/your/image.jpg' http://localhost:5001/api/predict_crop_health
```

### 2. Frontend Testing
1. Start both backend and frontend servers
2. Login as a farmer
3. Navigate to "Crop Health" in the sidebar
4. Upload an image and test the prediction

## 🎨 UI Features

### Upload Section
- File type validation
- File size validation (max 5MB)
- Image preview
- Drag-and-drop support

### Results Display
- Health status indicator (🌱 for healthy, ⚠️ for disease)
- Confidence percentage
- Crop and disease information
- Personalized recommendations
- Color-coded status (green for healthy, red for disease)

### Information Section
- How it works explanation
- Tips for best results
- Supported file formats

## 🔒 Security & Validation

### Backend Validation
- File type validation
- File size limits
- Model availability checks
- Comprehensive error handling

### Frontend Validation
- Client-side file validation
- Loading states
- Error message display
- User-friendly feedback

## 📱 Responsive Design

The Crop Health page is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🌐 Internationalization

The feature supports multiple languages:
- English (default)
- Hindi
- Telugu

Translation keys:
- `cropHealth`: "Crop Health"

## 🚨 Error Handling

### Common Errors
1. **Model not loaded**: Server returns 503
2. **No image provided**: Returns 400 with clear message
3. **Invalid file type**: Returns 400 with supported formats
4. **File too large**: Returns 400 with size limit
5. **Processing error**: Returns 500 with details

### User-Friendly Messages
- Clear error descriptions
- Actionable recommendations
- Visual error indicators

## 🔄 State Management

### React State
- `selectedFile`: Currently selected image file
- `previewUrl`: Image preview URL
- `isLoading`: Loading state for API calls
- `prediction`: Prediction results
- `error`: Error messages

## 🎯 Future Enhancements

### Potential Improvements
1. **Batch Processing**: Upload multiple images at once
2. **History**: Save previous predictions
3. **Treatment Recommendations**: Specific treatment suggestions
4. **Expert Consultation**: Connect with agriculture experts
5. **Offline Mode**: Cache model for offline predictions
6. **Image Enhancement**: Auto-crop and enhance images
7. **Disease Timeline**: Track disease progression over time

## 🐛 Troubleshooting

### Common Issues

1. **Model not loading**
   - Check if `plantvillage_deepcnn_fullmodel.pt` exists in root
   - Verify PyTorch installation
   - Check console for error messages

2. **API not responding**
   - Ensure Flask server is running on port 5001
   - Check CORS configuration
   - Verify network connectivity

3. **Image upload fails**
   - Check file size (max 5MB)
   - Verify file format (JPG, PNG, GIF, BMP)
   - Check browser console for errors

4. **Prediction errors**
   - Ensure image is clear and well-lit
   - Try different angles or lighting
   - Check if crop is supported by the model

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in browser console
3. Check Flask server logs
4. Test with the provided test script

## 🎉 Success!

The Crop Health feature is now fully integrated into AgriHelp! Farmers can:
- Upload crop images through an intuitive interface
- Get instant disease predictions with confidence scores
- Receive personalized recommendations
- Access the feature from their sidebar navigation

The implementation follows best practices for:
- Performance (model loaded once)
- Security (file validation)
- User Experience (responsive design)
- Error Handling (comprehensive validation)
- Internationalization (multi-language support) 