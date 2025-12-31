# AgriHelp 🌱

AgriHelp is a comprehensive agricultural assistance platform that combines machine learning predictions with a modern web interface to help farmers make informed decisions about their crops. The platform focuses on crop yield predictions and trend analysis for Telangana and Andhra Pradesh regions, providing farmers with data-driven insights to optimize their agricultural practices.

## 📁 Project Structure

```
AgriHelp/
├── backend/                          # Backend server and ML models
│   ├── __pycache__/                 # Python cache files
│   ├── venv/                        # Python virtual environment
│   ├── app.py                       # Main Flask application server
│   ├── trends.py                    # Crop trends analysis module
│   ├── TG_AP_CropData.csv           # Dataset for Telangana and Andhra Pradesh crops
│   ├── Telangana_Agriculture.ipynb  # Jupyter notebook for data analysis
│   ├── model_*.joblib              # ML models for different crops (27+ crops)
│   │   ├── model_BARLEY.joblib
│   │   ├── model_CASTOR.joblib
│   │   ├── model_CHICKPEA.joblib
│   │   ├── model_COTTON.joblib
│   │   ├── model_FINGER MILLET.joblib
│   │   ├── model_GROUNDNUT.joblib
│   │   ├── model_KHARIF SORGHUM.joblib
│   │   ├── model_LINSEED.joblib
│   │   ├── model_MAIZE.joblib
│   │   ├── model_MINOR PULSES.joblib
│   │   ├── model_OILSEEDS.joblib
│   │   ├── model_PEARL MILLET.joblib
│   │   ├── model_PIGEONPEA.joblib
│   │   ├── model_RABI SORGHUM.joblib
│   │   ├── model_RAPESEED AND MUSTARD.joblib
│   │   ├── model_RICE.joblib
│   │   ├── model_SAFFLOWER.joblib
│   │   ├── model_SESAMUM.joblib
│   │   ├── model_SOYABEAN.joblib
│   │   ├── model_SUGARCANE.joblib
│   │   ├── model_SUNFLOWER.joblib
│   │   ├── model_WHEAT.joblib
│   │   ├── model_FRUITS.joblib
│   │   ├── model_VEGETABLES.joblib
│   │   ├── model_POTATOES.joblib
│   │   ├── model_ONION.joblib
│   │   └── model_FODDER.joblib
│   ├── scaler_*.joblib             # Data scalers for different crops
│   │   ├── scaler_BARLEY.joblib
│   │   ├── scaler_CASTOR.joblib
│   │   ├── scaler_CHICKPEA.joblib
│   │   ├── scaler_COTTON.joblib
│   │   ├── scaler_FINGER MILLET.joblib
│   │   ├── scaler_GROUNDNUT.joblib
│   │   ├── scaler_KHARIF SORGHUM.joblib
│   │   ├── scaler_LINSEED.joblib
│   │   ├── scaler_MAIZE.joblib
│   │   ├── scaler_MINOR PULSES.joblib
│   │   ├── scaler_OILSEEDS.joblib
│   │   ├── scaler_PEARL MILLET.joblib
│   │   ├── scaler_PIGEONPEA.joblib
│   │   ├── scaler_RABI SORGHUM.joblib
│   │   ├── scaler_RAPESEED AND MUSTARD.joblib
│   │   ├── scaler_RICE.joblib
│   │   ├── scaler_SAFFLOWER.joblib
│   │   ├── scaler_SESAMUM.joblib
│   │   ├── scaler_SOYABEAN.joblib
│   │   ├── scaler_SUGARCANE.joblib
│   │   ├── scaler_SUNFLOWER.joblib
│   │   ├── scaler_WHEAT.joblib
│   │   ├── scaler_FRUITS.joblib
│   │   ├── scaler_VEGETABLES.joblib
│   │   ├── scaler_POTATOES.joblib
│   │   ├── scaler_ONION.joblib
│   │   └── scaler_FODDER.joblib
│   ├── crop_trends_model.joblib     # Model for crop trends prediction
│   ├── crop_trends_scaler.joblib    # Scaler for crop trends data
│   ├── requirements.txt             # Python backend dependencies
│   └── README.md                    # Backend documentation
│
├── src/                             # Frontend React application
│   ├── components/                  # Reusable React components
│   │   ├── ErrorBoundary.css       # Error handling component styles
│   │   ├── ErrorBoundary.jsx       # Error boundary component
│   │   ├── Login.css              # Login component styles
│   │   ├── Login.jsx             # Authentication component
│   │   ├── ProtectedRoute.jsx    # Route protection component
│   │   ├── Sidebar.css          # Sidebar navigation styles
│   │   ├── Sidebar.jsx         # Sidebar navigation component
│   │   ├── LanguageSwitcher.css # Language switcher styles
│   │   ├── LanguageSwitcher.jsx # Language selection component
│   │   ├── RoleBasedContent.css # Role-based content styles
│   │   └── RoleBasedContent.jsx # Role-based content component
│   │
│   ├── context/                    # React Context providers
│   │   └── AuthContext.jsx        # Authentication context provider
│   │
│   ├── data/                       # Data and configuration files
│   │   ├── telanganaData.js       # Telangana state data
│   │   ├── telanganaMandalsData.js # Telangana mandals data
│   │   ├── mandalsData.js         # General mandals data
│   │   ├── andhraPradeshData.js   # Andhra Pradesh state data
│   │   └── andhraPradeshMandalsData.js # Andhra Pradesh mandals data
│   │
│   ├── historycomponents/          # Historical data visualization
│   │   ├── ChartSection.css       # Chart component styles
│   │   ├── ChartSection.jsx      # Data visualization charts
│   │   ├── ErrorBoundary.css     # Error handling styles
│   │   ├── ErrorBoundary.jsx    # Error boundary for history
│   │   ├── FilterSection.css    # Filter component styles
│   │   ├── FilterSection.jsx   # Data filtering component
│   │   ├── Hero.css           # Hero section styles
│   │   ├── Hero.jsx          # Hero section component
│   │   ├── InsightsBox.css  # Insights display styles
│   │   └── InsightsBox.jsx # Insights display component
│   │
│   ├── profilecomponents/          # User profile components
│   │   ├── FarmerForm.jsx        # Farmer registration form
│   │   ├── FarmerForm.css       # Form styles
│   │   ├── Hero.jsx           # Profile hero section
│   │   └── Hero.css          # Hero section styles
│   │
│   ├── pages/                     # Application pages
│   │   ├── Dashboard.jsx         # Main dashboard view
│   │   ├── HistoryPage.css      # History page styles
│   │   ├── HistoryPage.jsx     # Historical data page
│   │   ├── Messages.jsx       # User messages page
│   │   ├── Profile.jsx       # User profile page
│   │   ├── Profile.css      # Profile page styles
│   │   └── Reports.jsx     # Reports and analytics page
│   │
│   ├── App.css                    # Main application styles
│   ├── App.jsx                   # Root application component
│   ├── index.css                # Global styles
│   ├── index.js                # Application entry point
│   └── i18n.js                 # Internationalization configuration
│
├── public/                          # Static assets
│   ├── index.html                  # HTML template
│   └── manifest.json              # Web app manifest file
│
├── prediction.py                    # ML prediction module
├── requirements.txt                 # Main Python dependencies
├── package.json                     # Node.js project configuration
└── package-lock.json               # Node.js dependency lock file

```

## 🚀 Features

### Crop Analysis and Prediction
- Machine Learning-based crop predictions for 27+ crops including:
  - Cereals: Rice, Wheat, Maize, Sorghum (Kharif & Rabi), Pearl Millet, Finger Millet, Barley
  - Pulses: Chickpea, Pigeonpea, Minor Pulses
  - Oilseeds: Groundnut, Sunflower, Soybean, Sesamum, Safflower, Rapeseed & Mustard, Castor, Linseed
  - Commercial Crops: Sugarcane, Cotton
  - Horticulture: Fruits, Vegetables, Potatoes, Onion
  - Others: Fodder

### Data Analysis Features
- Real-time crop trend analysis
- Historical data visualization
- Area, Production, and Yield predictions
- State-wise and year-wise filtering
- Interactive charts and graphs
- Comprehensive dashboard with insights

### Technical Features
- Modern React-based user interface
- Responsive design for all devices
- Multi-language support (English, Hindi, Telugu)
- User profile management
- Secure authentication system
- Error boundary handling
- RESTful API architecture
- CORS-enabled backend
- Role-based access control
- Comprehensive mandal-level data for both states

## 🛠️ Technology Stack

### Frontend
- React.js
- React Router DOM
- Recharts (for data visualization)
- Modern JavaScript (ES6+)
- i18next (Internationalization)
- CSS3 with modern features
- Context API for state management

### Backend
- Python 3.8+
- Machine Learning Libraries:
  - scikit-learn
  - XGBoost
  - pandas
  - numpy
- Flask (Web Framework)
- Flask-CORS
- Joblib (Model persistence)

## 🏗️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn package manager

### Frontend Setup
1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r backend/requirements.txt
   ```

3. Start the Flask server:
   ```bash
   cd backend
   python app.py
   ```

## 🚀 Running the Application

1. Start the frontend development server:
   ```bash
   npm start
   ```

2. Run the backend server (from the backend directory):
   ```bash
   python app.py
   ```

The application will be available at `http://localhost:3000`

## 📊 API Endpoints

### POST /data
- **Purpose**: Get crop trends and predictions
- **Parameters**:
  - `crop`: Crop name (required)
  - `state`: State name (optional)
  - `year`: Year (optional)
- **Response**: JSON containing trend data for area, production, yield, and predictions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for their invaluable tools and libraries
