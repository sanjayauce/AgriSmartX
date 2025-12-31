import numpy as np
import pandas as pd
import lime
import lime.lime_tabular
import shap
import matplotlib.pyplot as plt
import joblib
from sklearn.preprocessing import StandardScaler

class ModelInterpreter:
    def __init__(self, model, scaler, feature_names):
        self.model = model
        self.scaler = scaler
        self.feature_names = feature_names
        self.explainer = None
        
    def create_lime_explanation(self, X, num_features=10):
        """
        Create LIME explanations for the predictions
        """
        # Create LIME explainer
        explainer = lime.lime_tabular.LimeTabularExplainer(
            X,
            feature_names=self.feature_names,
            class_names=['Yield'],
            mode='regression'
        )
        
        # Generate explanation for a single instance
        exp = explainer.explain_instance(
            X[0], 
            self.model.predict,
            num_features=num_features
        )
        
        # Plot the explanation
        plt.figure(figsize=(10, 6))
        exp.as_pyplot_figure()
        plt.tight_layout()
        plt.savefig('lime_explanation.png')
        plt.close()
        
        return exp
    
    def create_shap_explanation(self, X):
        """
        Create SHAP explanations for the predictions
        """
        # Create SHAP explainer
        explainer = shap.TreeExplainer(self.model)
        
        # Calculate SHAP values
        shap_values = explainer.shap_values(X)
        
        # Plot summary plot
        plt.figure(figsize=(10, 6))
        shap.summary_plot(shap_values, X, feature_names=self.feature_names)
        plt.tight_layout()
        plt.savefig('shap_summary.png')
        plt.close()
        
        # Plot dependence plot for the most important feature
        plt.figure(figsize=(10, 6))
        shap.dependence_plot(0, shap_values, X, feature_names=self.feature_names)
        plt.tight_layout()
        plt.savefig('shap_dependence.png')
        plt.close()
        
        return shap_values

def analyze_crop_model(crop_name):
    """
    Analyze a specific crop model using both LIME and SHAP
    """
    # Load the model and scaler
    model = joblib.load(f'model_{crop_name}.joblib')
    scaler = joblib.load(f'scaler_{crop_name}.joblib')
    
    # Load the data
    df = pd.read_csv('TG_AP_CropData.csv')
    
    # Prepare features
    features = [f"{crop_name} AREA (1000 ha)", f"{crop_name} PRODUCTION (1000 tons)", 'Year']
    X = df[features].dropna()
    
    # Scale the features
    X_scaled = scaler.transform(X)
    
    # Create interpreter
    interpreter = ModelInterpreter(model, scaler, features)
    
    # Generate explanations
    lime_exp = interpreter.create_lime_explanation(X_scaled)
    shap_values = interpreter.create_shap_explanation(X_scaled)
    
    return {
        'lime_explanation': lime_exp,
        'shap_values': shap_values
    } 