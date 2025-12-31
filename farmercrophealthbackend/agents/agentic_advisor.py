# agents/agentic_advisor.py
import asyncio
import datetime
from typing import Dict, Any, List
from .agentic_base import AgenticBaseAgent, AgentTool
from .agentic_tools import AgenticToolRegistry
from .llm_client import get_llm_response

class AgenticAdvisorAgent(AgenticBaseAgent):
    def __init__(self, memory_manager, tool_registry: AgenticToolRegistry):
        super().__init__("agentic_advisor", memory_manager, tool_registry)
        
        # Register specialized agricultural tools
        self.register_tool(
            AgentTool(
                name="get_weather_conditions",
                description="Get current weather conditions for treatment planning",
                function=self._get_weather_tool,
                parameters={"location": "string"},
                confidence=0.9
            )
        )
        
        self.register_tool(
            AgentTool(
                name="search_treatment_guidelines",
                description="Search for official treatment guidelines",
                function=self._search_guidelines_tool,
                parameters={"crop": "string", "disease": "string"},
                confidence=0.85
            )
        )
        
        self.register_tool(
            AgentTool(
                name="check_product_availability",
                description="Check availability of recommended products",
                function=self._check_products_tool,
                parameters={"products": "list"},
                confidence=0.8
            )
        )
        
        self.register_tool(
            AgentTool(
                name="get_pesticide_info",
                description="Get pesticide information for specific disease and crop",
                function=self._get_pesticide_tool,
                parameters={"disease": "string", "crop": "string"},
                confidence=0.85
            )
        )
        
        self.register_tool(
            AgentTool(
                name="get_soil_data",
                description="Get soil conditions for treatment planning",
                function=self._get_soil_tool,
                parameters={"location": "string"},
                confidence=0.8
            )
        )
    
    async def process_request(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes the user's request to generate an enhanced advisory report.
        Simplified version that focuses on generating comprehensive advice.
        """
        crop = context.get("crop", "Unknown")
        disease = context.get("disease", "healthy")
        is_healthy = context.get("is_healthy", False)
        user_location = context.get("user_info", {}).get("location", "India")
        confidence = context.get("confidence", "70%")
        
        # Create a comprehensive prompt for the expert advisor
        plan_type = "Preventive Care Plan" if is_healthy else "Treatment Plan"
        
        prompt = f"""
        As an expert agricultural advisor with 20+ years of experience, create a comprehensive '{plan_type}' for a farmer in {user_location}.
        
        **Diagnosis Information:**
        - Crop: {crop}
        - Condition: {disease}
        - Status: {'Healthy' if is_healthy else 'Disease Detected'}
        - Confidence Level: {confidence}
        - Location: {user_location}
        
        **Your Task:**
        Generate a detailed, actionable, and comprehensive report in JSON format. The report must be easy to understand for a farmer and include the following sections:
        
        1. **Overall Assessment**: A brief, one-paragraph summary of the situation.
        2. **Immediate Actions**: A list of 3-4 critical steps the farmer should take right away.
        3. **Detailed Strategy**: A comprehensive plan with specific recommendations.
        4. **Weather & Environmental Considerations**: How local conditions affect the strategy.
        5. **Risk Analysis**: Potential risks and how to mitigate them.
        6. **Cost Analysis**: Estimated costs and budget considerations.
        7. **Timeline**: When to implement each step.
        
        **JSON Output Schema:**
        {{
          "title": "{plan_type} for {crop}",
          "overall_assessment": "string",
          "immediate_actions": ["string", "string", "string"],
          "detailed_strategy": {{
            "preventive_measures": ["string"],
            "organic_treatments": ["string"],
            "chemical_treatments": ["string"],
            "cultural_practices": ["string"]
          }},
          "environmental_analysis": {{
            "weather_considerations": "string",
            "soil_impact": "string",
            "seasonal_factors": "string"
          }},
          "risk_analysis": {{
            "potential_risks": [
                {{"risk": "string", "probability": "high/medium/low", "mitigation": "string"}}
            ]
          }},
          "cost_analysis": {{
            "estimated_costs": "string",
            "budget_considerations": "string",
            "cost_effective_alternatives": ["string"]
          }},
          "implementation_timeline": {{
            "immediate": ["string"],
            "short_term": ["string"],
            "long_term": ["string"]
          }},
          "expert_confidence": 0.85,
          "disclaimer": "This is an AI-generated recommendation. Always verify with a local expert."
        }}
        
        Make the response practical, actionable, and tailored to {user_location} conditions.
        """

        try:
            # Generate the final response using the LLM
            final_response = await get_llm_response(prompt, "AgenticAdvisorAgent")
            
            # If LLM call fails, provide a fallback response
            if "error" in final_response:
                fallback_response = {
                    "title": f"{plan_type} for {crop}",
                    "overall_assessment": f"Based on the analysis, your {crop} shows signs of {disease}. This requires immediate attention.",
                    "immediate_actions": [
                        f"Remove and destroy infected plant parts",
                        f"Apply appropriate treatment for {disease}",
                        f"Monitor the crop closely for further spread",
                        f"Consult with local agricultural expert"
                    ],
                    "detailed_strategy": {
                        "preventive_measures": ["Practice crop rotation", "Maintain proper spacing", "Use disease-resistant varieties"],
                        "organic_treatments": ["Apply neem oil", "Use copper-based fungicides", "Implement biological controls"],
                        "chemical_treatments": ["Apply recommended pesticides", "Follow safety guidelines", "Monitor effectiveness"],
                        "cultural_practices": ["Improve air circulation", "Avoid overhead irrigation", "Maintain field hygiene"]
                    },
                    "environmental_analysis": {
                        "weather_considerations": "Consider local weather patterns for treatment timing",
                        "soil_impact": "Ensure soil health for better plant resistance",
                        "seasonal_factors": "Plan treatments based on growing season"
                    },
                    "risk_analysis": {
                        "potential_risks": [
                            {"risk": "Disease spread", "probability": "high", "mitigation": "Immediate isolation and treatment"},
                            {"risk": "Yield loss", "probability": "medium", "mitigation": "Early intervention and monitoring"}
                        ]
                    },
                    "cost_analysis": {
                        "estimated_costs": "₹500-2000 per acre depending on treatment method",
                        "budget_considerations": "Consider both immediate treatment and long-term prevention costs",
                        "cost_effective_alternatives": ["Use organic methods first", "Bulk purchase treatments", "Community sharing of equipment"]
                    },
                    "implementation_timeline": {
                        "immediate": ["Start treatment within 24-48 hours"],
                        "short_term": ["Monitor progress weekly", "Adjust treatment as needed"],
                        "long_term": ["Implement preventive measures", "Plan for next season"]
                    },
                    "expert_confidence": 0.75,
                    "disclaimer": "This is a fallback recommendation. Always verify with a local expert."
                }
                final_response = fallback_response
            
            # Combine agentic metadata with the LLM response
            final_result = {
                "final_response": final_response,
                "actions_executed": 1,
                "confidence": 0.85,
                "learning_applied": "recent_experience" in context,
                "tool_results": []
            }
            
            return final_result
            
        except Exception as e:
            print(f"Error in AgenticAdvisorAgent process_request: {e}")
            # Return a basic fallback response
            return {
                "final_response": {
                    "title": f"Basic {plan_type} for {crop}",
                    "overall_assessment": f"Your {crop} requires attention for {disease}.",
                    "immediate_actions": ["Consult local expert", "Apply basic treatment", "Monitor closely"],
                    "error": f"Failed to generate detailed plan: {str(e)}"
                },
                "actions_executed": 0,
                "confidence": 0.5,
                "learning_applied": False,
                "tool_results": []
            }

    def get_tool_result(self, agentic_result, tool_name):
        """Helper to safely extract tool results."""
        for res in agentic_result.get("results", []):
            if res.get("tool_name") == tool_name and res.get("success"):
                return res.get("result", f"No data from {tool_name}")
        return f"{tool_name} tool not executed."
    
    async def create_enhanced_treatment_plan(self, crop: str, disease: str, user_location: str = "India") -> Dict[str, Any]:
        """Enhanced treatment plan creation with agentic capabilities"""
        
        # Add goals for this request
        self.add_goal(f"Create comprehensive treatment plan for {disease} on {crop}", priority=9)
        self.add_goal(f"Verify weather conditions for {user_location}", priority=7)
        self.add_goal(f"Check product availability for recommended treatments", priority=8)
        self.add_goal(f"Analyze soil conditions for optimal treatment", priority=6)
        self.add_goal(f"Research latest treatment guidelines", priority=8)
        
        # Set context
        context = {
            "crop": crop,
            "disease": disease,
            "location": user_location,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "user_type": "farmer",
            "request_type": "treatment_plan"
        }
        
        # Run agentic cycle
        result = await self.run_agentic_cycle(context)
        
        # If agentic cycle didn't produce results, fall back to traditional method
        if not result.get("results"):
            return await self.process_request(context)
        
        # Extract data from results
        weather_data = None
        guidelines = None
        product_availability = None
        pesticide_info = None
        soil_data = None
        
        for action_result in result.get("results", []):
            if action_result.get("success"):
                result_data = action_result.get("result", {})
                if "weather_data" in str(result_data):
                    weather_data = result_data
                elif "guidelines" in str(result_data):
                    guidelines = result_data
                elif "availability" in str(result_data):
                    product_availability = result_data
                elif "pesticides" in str(result_data):
                    pesticide_info = result_data
                elif "soil_data" in str(result_data):
                    soil_data = result_data
        
        # Generate enhanced treatment plan using all collected data
        enhanced_prompt = f"""
        Create an enhanced treatment plan using all available data:
        
        Crop: {crop}
        Disease: {disease}
        Location: {user_location}
        Weather: {weather_data}
        Guidelines: {guidelines}
        Product Availability: {product_availability}
        Pesticide Info: {pesticide_info}
        Soil Data: {soil_data}
        
        Generate a comprehensive treatment plan that considers:
        1. Weather conditions for application timing
        2. Official guidelines and best practices
        3. Available products in the area
        4. Soil conditions and compatibility
        5. Cost considerations
        6. Safety precautions
        7. Environmental impact
        
        Return as JSON with structure:
        {{
            "title": "Enhanced Treatment Plan",
            "weather_considerations": ["consideration1", "consideration2"],
            "soil_analysis": "Soil-based recommendations",
            "treatment_steps": ["step1", "step2", "step3"],
            "recommended_products": [
                {{
                    "name": "product_name",
                    "type": "organic/chemical",
                    "availability": "yes/no",
                    "price": "price_range",
                    "effectiveness": "high/medium/low",
                    "safety_level": "low/moderate/high"
                }}
            ],
            "application_timing": "Best time to apply based on weather",
            "safety_notes": ["note1", "note2"],
            "cost_estimate": "Estimated cost range",
            "environmental_impact": "Environmental considerations",
            "disclaimer": "Safety disclaimer",
            "confidence": 0.85,
            "data_sources": ["weather_api", "guidelines_db", "product_db"]
        }}
        """
        
        enhanced_response = await get_llm_response(enhanced_prompt, "EnhancedAgenticAdvisor")
        
        return enhanced_response if "error" not in enhanced_response else {
            "title": "Enhanced Treatment Plan",
            "error": enhanced_response.get("error", "Failed to generate enhanced plan"),
            "fallback_plan": await self.process_request(context),
            "agentic_cycle_info": {
                "actions_planned": result.get("actions_planned", 0),
                "actions_executed": result.get("actions_executed", 0),
                "confidence": result.get("confidence", 0)
            }
        }
    
    async def _get_weather_tool(self, location: str) -> Dict[str, Any]:
        """Tool to get weather conditions for treatment planning"""
        result = await self.tool_registry.get_weather_data(location)
        return {
            "success": result.success,
            "weather_data": result.data if result.success else None,
            "error": result.error,
            "confidence": result.confidence
        }
    
    async def _search_guidelines_tool(self, crop: str, disease: str) -> Dict[str, Any]:
        """Tool to search for official treatment guidelines"""
        query = f"{crop} {disease} treatment guidelines"
        result = await self.tool_registry.search_agricultural_database(query)
        return {
            "success": result.success,
            "guidelines": result.data if result.success else None,
            "error": result.error,
            "confidence": result.confidence
        }
    
    async def _check_products_tool(self, products: List[str]) -> Dict[str, Any]:
        """Tool to check product availability"""
        # This would integrate with local supplier databases
        availability = {}
        for product in products:
            # Simulate availability check
            availability[product] = {
                "available": True,
                "suppliers": ["Local Agri Store", "Online Supplier", "Cooperative Society"],
                "price_range": "₹200-800",
                "delivery_time": "1-3 days",
                "stock_level": "High"
            }
        
        return {
            "success": True,
            "availability": availability,
            "confidence": 0.8
        }
    
    async def _get_pesticide_tool(self, disease: str, crop: str) -> Dict[str, Any]:
        """Tool to get pesticide information"""
        result = await self.tool_registry.get_pesticide_info(disease, crop)
        return {
            "success": result.success,
            "pesticide_data": result.data if result.success else None,
            "error": result.error,
            "confidence": result.confidence
        }
    
    async def _get_soil_tool(self, location: str) -> Dict[str, Any]:
        """Tool to get soil data"""
        result = await self.tool_registry.get_soil_data(location)
        return {
            "success": result.success,
            "soil_data": result.data if result.success else None,
            "error": result.error,
            "confidence": result.confidence
        } 