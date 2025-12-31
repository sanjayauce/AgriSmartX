#!/usr/bin/env python3
"""
Test script to verify response format handling
"""

import json

def test_response_formats():
    """Test different response formats that the frontend should handle"""
    
    # Original response format
    original_response = {
        "prediction": {
            "crop": "Cherry (including sour)",
            "disease": "Powdery mildew",
            "confidence": "99.89%",
            "is_healthy": False
        },
        "advisory": {
            "title": "Treatment for Powdery Mildew on Cherry (including sour)",
            "steps": [
                "Remove and destroy severely infected leaves and shoots.",
                "Apply a horticultural oil spray to the affected leaves.",
                "Consider using a fungicide labeled for powdery mildew."
            ]
        },
        "vegetation_index": {
            "title": "Vegetation Index Analysis (Simulated NDVI)",
            "score": "0.27",
            "interpretation": "The plant shows signs of stress",
            "details": "This NDVI score is a simulation based on the visual prediction."
        },
        "support_services": {
            "financial_benefits": {
                "title": "Relevant Support Schemes for Indian Farmers",
                "schemes": [
                    {"name": "NMSA", "description": "National Mission on Sustainable Agriculture"},
                    {"name": "PM-KISAN", "description": "Pradhan Mantri Kisan Samman Nidhi"}
                ]
            },
            "local_experts": {
                "title": "Local Support Contacts",
                "contacts": [
                    {"name": "Local Agri-Expert", "phone": "+91-9876543210", "location": "District Agri-Office"}
                ]
            }
        }
    }
    
    # Agentic AI response format
    agentic_response = {
        "request_info": {
            "user_id": "farmer1@gmail.com",
            "language": "en",
            "timestamp_utc": "2024-01-15T10:30:00Z",
            "session_id": "session_20240115_103000"
        },
        "prediction": {
            "crop": "Cherry (including sour)",
            "disease": "Powdery mildew",
            "confidence": "99.89%",
            "is_healthy": False
        },
        "agentic_response": {
            "title": "Enhanced AI Analysis: Powdery Mildew Treatment",
            "message": "Multi-agent analysis complete with personalized recommendations",
            "treatment_plan": [
                "Immediate: Remove infected leaves and improve air circulation",
                "Short-term: Apply organic neem oil solution (3 applications, 7-day intervals)",
                "Long-term: Implement preventive pruning and spacing strategies"
            ],
            "vegetation_index": {
                "title": "Advanced Vegetation Analysis",
                "score": "0.27",
                "interpretation": "Moderate stress detected, consistent with powdery mildew infection",
                "details": "NDVI analysis indicates reduced photosynthetic activity."
            },
            "support_services": {
                "financial_benefits": {
                    "title": "Personalized Support Schemes",
                    "schemes": [
                        {"name": "NMSA", "description": "Eligible for integrated pest management support"},
                        {"name": "PM-KISAN", "description": "Direct income support available"}
                    ]
                }
            },
            "community_insights": {
                "title": "Local Community Experience",
                "insights": [
                    "Local farmers report 80% success with neem oil treatment",
                    "Pruning in early spring reduces infection by 60%"
                ]
            },
            "sustainability_tips": {
                "title": "Eco-Friendly Management",
                "tips": [
                    "Use companion planting with garlic to deter powdery mildew",
                    "Implement drip irrigation to reduce leaf wetness"
                ]
            }
        },
        "agentic_metadata": {
            "agents_used": ["advisor", "community", "sustainability"],
            "total_actions": 12,
            "overall_confidence": 0.95,
            "learning_applied": True,
            "conflicts_resolved": 1
        },
        "system_log": {
            "coordination_timestamp": "2024-01-15T10:30:05Z",
            "agent_performance": {
                "advisor": {"success_rate": 0.92, "total_actions": 45},
                "community": {"success_rate": 0.88, "total_actions": 23}
            }
        }
    }
    
    # Mixed response format (some original, some agentic)
    mixed_response = {
        "prediction": {
            "crop": "Cherry (including sour)",
            "disease": "Powdery mildew",
            "confidence": "99.89%",
            "is_healthy": False
        },
        "advisory": {
            "title": "Treatment for Powdery Mildew",
            "steps": ["Basic treatment steps"]
        },
        "agentic_response": {
            "title": "Enhanced Analysis",
            "treatment_plan": ["Advanced treatment plan"]
        },
        "agentic_metadata": {
            "agents_used": ["advisor"],
            "total_actions": 5,
            "overall_confidence": 0.85,
            "learning_applied": False
        }
    }
    
    print("🧪 Testing Response Format Handling...")
    print("=" * 50)
    
    # Test original format
    print("\n1️⃣ Testing Original Response Format:")
    test_format(original_response, "original")
    
    # Test agentic format
    print("\n2️⃣ Testing Agentic AI Response Format:")
    test_format(agentic_response, "agentic")
    
    # Test mixed format
    print("\n3️⃣ Testing Mixed Response Format:")
    test_format(mixed_response, "mixed")
    
    print("\n✅ All response format tests completed!")
    print("\n📝 The frontend should now handle all these formats correctly.")

def test_format(response, format_type):
    """Test a specific response format"""
    try:
        # Test prediction structure
        prediction = response.get("prediction", {})
        print(f"   ✅ Prediction: {prediction.get('crop', 'N/A')} - {prediction.get('disease', 'N/A')}")
        
        # Test advisory (original format)
        if "advisory" in response:
            advisory = response["advisory"]
            print(f"   ✅ Advisory: {advisory.get('title', 'N/A')}")
            print(f"   ✅ Steps: {len(advisory.get('steps', []))} steps")
        
        # Test agentic response
        if "agentic_response" in response:
            agentic = response["agentic_response"]
            print(f"   ✅ Agentic Response: {agentic.get('title', 'N/A')}")
            if "treatment_plan" in agentic:
                plan = agentic["treatment_plan"]
                if isinstance(plan, list):
                    print(f"   ✅ Treatment Plan: {len(plan)} steps")
                else:
                    print(f"   ✅ Treatment Plan: Single step")
        
        # Test agentic metadata
        if "agentic_metadata" in response:
            metadata = response["agentic_metadata"]
            print(f"   ✅ Agents Used: {metadata.get('agents_used', [])}")
            print(f"   ✅ Total Actions: {metadata.get('total_actions', 0)}")
            print(f"   ✅ Confidence: {metadata.get('overall_confidence', 0):.2f}")
            print(f"   ✅ Learning Applied: {metadata.get('learning_applied', False)}")
        
        # Test support services
        support_services = response.get("support_services") or response.get("agentic_response", {}).get("support_services")
        if support_services:
            print(f"   ✅ Support Services: Available")
        
        # Test vegetation index
        vegetation = response.get("vegetation_index") or response.get("agentic_response", {}).get("vegetation_index")
        if vegetation:
            print(f"   ✅ Vegetation Index: {vegetation.get('score', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error testing {format_type} format: {e}")
        return False

if __name__ == "__main__":
    test_response_formats() 