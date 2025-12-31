# agents/orchestrator.py

import asyncio
import datetime
from . import advisor_agent, benefit_agent, linker_agent, community_agent, green_agent, logger_agent, ndvi_agent

async def run_agents(class_name: str, confidence: str, user_info: dict) -> dict:
    """
    Orchestrates ASYNCHRONOUS calls to all agents to build a comprehensive, enriched JSON response.

    Args:
        class_name: The predicted class name from the model.
        confidence: The confidence score from the model.
        user_info: A dictionary containing user-specific data like ID and language.

    Returns:
        A dictionary containing the combined outputs from all agents.
    """
    # 1. Separate the crop and disease from the class_name
    try:
        crop, disease = class_name.split('___', 1)
        disease = disease.replace('_', ' ') # Format for readability
        crop = crop.replace('_', ' ')
    except ValueError:
        crop = "Unknown"
        disease = class_name.replace('_', ' ')

    # 2. Define all agent tasks to be run concurrently
    # The 'if not "healthy" in disease.lower()' ensures we only call AI for actual problems.
    agent_tasks = []
    if "healthy" not in disease.lower():
        agent_tasks.extend([
            advisor_agent.get_treatment_plan(crop, disease),
            benefit_agent.get_farmer_benefits(crop, disease),
            community_agent.get_community_insights(crop, disease),
            green_agent.get_eco_friendly_tips(crop, disease),
        ])
    
    # 3. Run the tasks concurrently and gather the results
    results = await asyncio.gather(*agent_tasks)
    
    # Unpack results if tasks were run, otherwise use default values
    if agent_tasks:
        treatment_plan, benefits, community_insights, eco_tips = results
    else: # Default values for healthy plants
        treatment_plan = {"title": "Preventive Care", "steps": ["Your plant looks healthy. Keep up the good work!", "Continue regular monitoring."], "recommended_products": [], "disclaimer": ""}
        benefits = {"title": "No benefits needed", "schemes": []}
        community_insights = {"title": "No community insights needed", "insights": []}
        eco_tips = {"title": "General Eco-Friendly Tips", "tips": ["Continue using sustainable practices like crop rotation and composting."]}

    # 4. Call synchronous agents directly
    local_experts = linker_agent.find_local_experts(class_name)
    log_entry = logger_agent.log_prediction_event(class_name, confidence)
    ndvi_analysis = ndvi_agent.get_ndvi_analysis(class_name)

    # 5. Assemble the final enriched JSON response
    enriched_response = {
        "request_info": {
            "user_id": user_info.get("farmer_id", "anonymous"),
            "language": user_info.get("language", "en"),
            "timestamp_utc": datetime.datetime.utcnow().isoformat()
        },
        "prediction": {
            "crop": crop,
            "disease": disease,
            "confidence": confidence,
            "is_healthy": "healthy" in disease.lower()
        },
        "vegetation_index": ndvi_analysis,
        "advisory": treatment_plan,
        "support_services": {
            "financial_benefits": benefits,
            "local_experts": local_experts,
        },
        "community_insights": community_insights,
        "sustainability_tips": eco_tips,
        "system_log": log_entry # For debugging or internal use
    }
    
    return enriched_response 