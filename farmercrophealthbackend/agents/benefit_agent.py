# agents/benefit_agent.py
import asyncio
from .llm_client import get_llm_response_sync

async def get_farmer_benefits(crop: str, disease: str) -> dict:
    """
    Identifies potential Indian government schemes for a farmer by running the sync LLM call in a separate thread.
    """
    json_schema = {
        "title": "Relevant Support Schemes for Indian Farmers",
        "schemes": [{
            "name": "Scheme Name",
            "description": "A brief, clear description of the scheme and its direct relevance to the farmer's situation.",
            "eligibility": "A concise summary of the key eligibility criteria."
        }]
    }

    prompt = f"""
    You are an expert in Indian agricultural policy. A farmer needs to know about government support schemes relevant to their situation.

    **Crop:** {crop}
    **Disease/Condition:** {disease}
    **Location:** India

    Identify 1-2 of the most relevant central or state-level Indian government schemes.

    Your response must be a JSON object adhering to this schema. If no schemes are directly relevant, return an empty "schemes" list.
    
    **JSON Schema:**
    ```json
    {json_schema}
    ```
    """

    response = await asyncio.to_thread(get_llm_response_sync, prompt, "BenefitAgent")
    
    return response if "error" not in response else {
        "title": "AI Benefits Advisor Error", 
        "schemes": [{"name": "Could not fetch schemes", "description": response.get("error", "An unknown error occurred."), "eligibility": "N/A"}]
    } 