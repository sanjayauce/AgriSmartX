# agents/advisor_agent.py
import asyncio
from .llm_client import get_llm_response_sync

async def get_treatment_plan(crop: str, disease: str) -> dict:
    """
    Generates a detailed, AI-powered treatment plan by running the sync LLM call in a separate thread.
    """
    # Define the desired JSON structure for the Gemini model's response
    json_schema = {
        "title": "Treatment for {disease} on {crop}",
        "steps": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
        "recommended_products": ["Generic product type 1", "Generic product type 2"],
        "disclaimer": "This is an AI-generated recommendation. Always consult a local agricultural expert before applying any treatment."
    }

    # Engineer the prompt for the Gemini model
    prompt = f"""
    You are an expert agricultural advisor. A farmer has identified a plant disease and needs a clear, practical treatment plan.

    **Crop:** {crop}
    **Disease:** {disease}

    Provide a treatment plan based on this information. Your response must be a JSON object that adheres to the following schema.

    **JSON Schema:**
    ```json
    {json_schema}
    ```
    """

    # Get the response from the LLM by running the sync function in a thread
    response = await asyncio.to_thread(get_llm_response_sync, prompt, "AdvisorAgent")
    
    # Return the parsed dictionary or an error message
    return response if "error" not in response else {
        "title": "AI Advisor Error", 
        "steps": ["Could not generate a treatment plan."],
        "recommended_products": [],
        "disclaimer": response.get("error", "An unknown error occurred.")
    } 