# agents/llm_client.py

import os
import json
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

# genai.configure(api_key=API_KEY)

def get_async_client():
    """
    Creates and returns a new asynchronous Gemini client instance.
    This ensures that each request gets a fresh client, avoiding event loop issues.
    """
    genai.configure(api_key=API_KEY)
    generation_config = {
      "temperature": 0.7,
      "response_mime_type": "application/json",
    }
    return genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config
    )

async def get_llm_response(prompt: str, agent_name: str) -> dict:
    """
    Gets a structured JSON response from the Gemini model using a fresh,
    on-demand async client.
    """
    model = get_async_client() # Get a fresh client for this request

    for attempt in range(3):
        response = None
        try:
            response = await model.generate_content_async(prompt)
            return json.loads(response.text)
        except json.JSONDecodeError:
            print(f"⚠️ ({agent_name}) Gemini response was not valid JSON. Retrying...")
            await asyncio.sleep(1)
        except Exception as e:
            if response and hasattr(response, 'prompt_feedback') and response.prompt_feedback.block_reason:
                block_reason = response.prompt_feedback.block_reason.name
                print(f"❌ ({agent_name}) Prompt blocked by Gemini. Reason: {block_reason}")
                return {"error": f"Request blocked by safety filter: {block_reason}"}
            
            print(f"❌ ({agent_name}) An error occurred while calling Gemini: {e}")
            return {"error": f"Failed to get response from Gemini: {e}"}
            
    return {"error": "Failed to get valid JSON from Gemini after multiple attempts."}
