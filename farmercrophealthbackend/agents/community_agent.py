# agents/community_agent.py
from typing import Dict, Any
from .agentic_base import AgenticBaseAgent
from .llm_client import get_llm_response

class CommunityAgent(AgenticBaseAgent):
    """
    An agent that simulates fetching and summarizing insights from a farming community.
    """
    def __init__(self, memory_manager, tool_registry):
        super().__init__("community_agent", memory_manager, tool_registry)
        self.add_goal("Provide real-world community insights", priority=7)

    async def process_request(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates simulated community insights based on the crop and disease context.
        """
        crop = context.get("crop", "Unknown")
        disease = context.get("disease", "healthy")
        is_healthy = context.get("is_healthy", True)

        if is_healthy:
            prompt_focus = f"community-sourced tips for keeping {crop} plants healthy and maximizing yield"
        else:
            prompt_focus = f"practical, real-world advice from other farmers on managing {disease} in {crop} plants"

        prompt = f"""
        You are an AI that summarizes discussions from a large online community of farmers.
        Based on thousands of forum posts and discussions, summarize the most effective, practical, and frequently mentioned advice for the following situation:

        - Crop: {crop}
        - Condition: {'Healthy' if is_healthy else disease}

        The goal is to provide {prompt_focus}. The tone should be helpful and reflect the collective wisdom of experienced farmers.

        Please provide your response in the following JSON format:
        {{
          "title": "Wisdom from the Farming Community",
          "summary": "A brief summary of the community's general sentiment or key takeaway.",
          "top_tips": [
            {{
              "tip": "A summary of a popular tip or technique.",
              "success_rate": "A simulated success rate based on community feedback (e.g., '~75% of users report success').",
              "quote": "A short, representative quote from a community member."
            }},
            {{
              "tip": "Another popular tip.",
              "success_rate": "A simulated success rate.",
              "quote": "Another short, representative quote."
            }}
          ],
          "common_mistakes": ["A common mistake to avoid, as mentioned by the community.", "Another common mistake."]
        }}
        """

        final_response = await get_llm_response(prompt, "CommunityAgent")

        return {
            "final_response": final_response if "error" not in final_response else {"error": "Could not generate community insights."},
            "actions_executed": 1,
            "confidence": self.confidence,
        } 