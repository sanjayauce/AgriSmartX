# agents/green_agent.py
import asyncio
from .llm_client import get_llm_response_sync

async def get_eco_friendly_tips(crop: str, disease: str) -> dict:
    """
    Generates eco-friendly farming tips by running the sync LLM call in a separate thread.
    """
    json_schema = {
        "title": "Eco-Friendly Tips for Managing {disease}",
        "tips": [
            "Actionable, sustainable tip 1.",
            "Actionable, sustainable tip 2."
        ]
    }

    prompt = f"""
    You are a specialist in sustainable and organic farming. A farmer needs eco-friendly advice for a specific crop disease.

    **Crop:** {crop}
    **Disease:** {disease}

    Provide 2 distinct and actionable eco-friendly tips for this issue. Focus on non-chemical, sustainable methods.

    Your response must be a JSON object adhering to this schema:
    
    **JSON Schema:**
    ```json
    {json_schema}
    ```
    """
    response = await asyncio.to_thread(get_llm_response_sync, prompt, "GreenAgent")
    
    return response if "error" not in response else {
        "title": "AI Green Agent Error",
        "tips": [response.get("error", "An unknown error occurred.")]
    } 