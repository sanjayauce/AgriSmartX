from typing import Dict, Any
from .agentic_base import AgenticBaseAgent
from .llm_client import get_llm_response

class SustainabilityAgent(AgenticBaseAgent):
    """
    An agent focused on providing eco-friendly and sustainable agricultural advice.
    """
    def __init__(self, memory_manager, tool_registry):
        super().__init__("sustainability_agent", memory_manager, tool_registry)
        self.add_goal("Promote sustainable farming practices", priority=8)

    async def process_request(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates sustainability-focused tips based on the crop and disease context.
        """
        crop = context.get("crop", "Unknown")
        disease = context.get("disease", "healthy")
        is_healthy = context.get("is_healthy", True)

        if is_healthy:
            prompt_focus = "preventive and soil-enriching sustainable practices"
        else:
            prompt_focus = f"eco-friendly and sustainable methods to manage {disease}"

        prompt = f"""
        As a sustainability expert in agriculture, provide a concise set of eco-friendly tips for a farmer dealing with a '{crop}' crop.
        The current condition is: {'Healthy' if is_healthy else disease}.

        Focus on {prompt_focus}. The advice should be practical, low-cost, and beneficial for the long-term health of the farm's ecosystem.

        Please provide your response in the following JSON format:
        {{
          "sustainability_score": "A rating from 1-10 on the sustainability of current practices, inferred from the context (provide a score like 7/10).",
          "title": "Eco-Friendly Recommendations",
          "summary": "A brief summary of the sustainable approach.",
          "tips": [
            {{"tip": "A specific, actionable tip.", "benefit": "The environmental or long-term benefit of this tip."}},
            {{"tip": "Another specific, actionable tip.", "benefit": "The benefit of this tip."}}
          ]
        }}
        """

        final_response = await get_llm_response(prompt, "SustainabilityAgent")

        return {
            "final_response": final_response if "error" not in final_response else {"error": "Could not generate sustainability tips."},
            "actions_executed": 1, 
            "confidence": self.confidence,
        } 