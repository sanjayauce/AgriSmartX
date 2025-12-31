# agentic_health.py
import sys
import os
import asyncio
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from inference import predict as model_predict
from agents.agentic_orchestrator import AgenticOrchestrator

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)

# Initialize agentic orchestrator
agentic_orchestrator = AgenticOrchestrator()

# --- Agentic AI Endpoint ---
@app.route('/agentic_predict', methods=['POST'])
def agentic_predict():
    """
    Handles the image prediction request using the agentic AI pipeline.
    This endpoint provides enhanced, autonomous AI capabilities.
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
        "language": request.headers.get("Accept-Language", "en-US"),
        "location": request.form.get("location", "India"),
        "user_type": request.form.get("user_type", "farmer")
    }

    try:
        # Use agentic coordination for enhanced response
        enriched_response = asyncio.run(agentic_orchestrator.coordinate_agentic_agents(class_name, confidence, user_info))
        return jsonify(enriched_response)
    except Exception as e:
        print(f"❌ Agentic coordination error: {e}")
        return jsonify({'error': f'Error processing result: {e}'}), 500

# --- Agentic System Status Endpoint ---
@app.route('/agentic_status', methods=['GET'])
def agentic_status():
    """
    Get the status of the agentic AI system
    """
    try:
        status = {
            "system": "Agentic AI Crop Health System",
            "status": "active",
            "agents": {
                name: {
                    "status": "active",
                    "tools": len(agent.tools),
                    "goals": len(agent.goals),
                    "performance": agentic_orchestrator.memory_manager.get_agent_performance(agent.agent_id, days=7)
                }
                for name, agent in agentic_orchestrator.agents.items()
            },
            "memory": {
                "total_memories": len(agentic_orchestrator.coordination_history),
                "memory_manager": "active"
            },
            "tools": {
                "weather_api": "simulated",
                "soil_api": "simulated", 
                "market_api": "simulated",
                "agricultural_db": "simulated"
            },
            "capabilities": [
                "Autonomous decision making",
                "Memory and learning",
                "Tool usage",
                "Conflict resolution",
                "Goal-oriented behavior",
                "Performance adaptation"
            ]
        }
        return jsonify(status), 200
    except Exception as e:
        return jsonify({'error': f'Status check failed: {e}'}), 500

# --- Agentic Learning Endpoint ---
@app.route('/agentic_learn', methods=['POST'])
def agentic_learn():
    """
    Provide feedback to improve agentic learning
    """
    try:
        data = request.get_json()
        feedback = data.get('feedback', {})
        session_id = data.get('session_id')
        user_rating = data.get('user_rating', 0)
        
        # Store user feedback for learning
        if session_id and user_rating > 0:
            # Find the session in coordination history
            for session in agentic_orchestrator.coordination_history:
                if session.get('final_response', {}).get('request_info', {}).get('session_id') == session_id:
                    # Update success scores based on user feedback
                    for agent_name, agent in agentic_orchestrator.agents.items():
                        if agent_name in session.get('results', {}):
                            # Calculate success score from user rating (1-5 scale to 0-1 scale)
                            success_score = user_rating / 5.0
                            
                            # Create memory entry for learning
                            from agents.agentic_memory import AgentMemory
                            memory = AgentMemory(
                                agent_id=agent.agent_id,
                                timestamp=datetime.datetime.utcnow().isoformat(),
                                context=session.get('context', {}),
                                action_taken="User feedback received",
                                outcome={"user_rating": user_rating, "feedback": feedback},
                                confidence=1.0,
                                user_feedback=feedback,
                                success_score=success_score
                            )
                            agentic_orchestrator.memory_manager.store_memory(memory)
                    break
        
        return jsonify({
            "message": "Feedback received and stored for learning",
            "session_id": session_id,
            "user_rating": user_rating
        }), 200
    except Exception as e:
        return jsonify({'error': f'Learning update failed: {e}'}), 500

# --- Agentic Performance Endpoint ---
@app.route('/agentic_performance', methods=['GET'])
def agentic_performance():
    """
    Get performance metrics for all agents
    """
    try:
        performance_data = {}
        
        for agent_name, agent in agentic_orchestrator.agents.items():
            performance_data[agent_name] = {
                "agent_id": agent.agent_id,
                "performance_7_days": agentic_orchestrator.memory_manager.get_agent_performance(agent.agent_id, days=7),
                "performance_30_days": agentic_orchestrator.memory_manager.get_agent_performance(agent.agent_id, days=30),
                "current_settings": {
                    "confidence_threshold": agent.confidence_threshold,
                    "learning_rate": agent.learning_rate,
                    "total_goals": len(agent.goals),
                    "active_goals": len([g for g in agent.goals if g.status == "pending"])
                }
            }
        
        return jsonify({
            "system_performance": performance_data,
            "coordination_sessions": len(agentic_orchestrator.coordination_history),
            "last_session": agentic_orchestrator.coordination_history[-1] if agentic_orchestrator.coordination_history else None
        }), 200
    except Exception as e:
        return jsonify({'error': f'Performance check failed: {e}'}), 500

# --- Cleanup on shutdown ---
@app.teardown_appcontext
def cleanup(error):
    if agentic_orchestrator:
        try:
            asyncio.run(agentic_orchestrator.close())
        except:
            pass

# --- Main Execution ---
if __name__ == '__main__':
    print("🚀 Starting Agentic AI Crop Health System...")
    print("📊 Agentic endpoints available:")
    print("   - POST /agentic_predict - Enhanced prediction with agentic AI")
    print("   - GET  /agentic_status - System status")
    print("   - POST /agentic_learn - Provide feedback for learning")
    print("   - GET  /agentic_performance - Performance metrics")
    print("🔧 Original system still available at /predict")
    
    app.run(debug=True, port=5003) 