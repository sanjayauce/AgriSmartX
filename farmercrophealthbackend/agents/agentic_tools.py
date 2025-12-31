# agents/agentic_tools.py
import aiohttp
import asyncio
import json
import random
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
import os

@dataclass
class ToolResult:
    success: bool
    data: Any
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    confidence: float = 0.8

class AgenticToolRegistry:
    def __init__(self):
        self.session = None
        self.weather_api_key = os.getenv("WEATHER_API_KEY", "demo_key")
        self.soil_api_key = os.getenv("SOIL_API_KEY", "demo_key")
        self.market_api_key = os.getenv("MARKET_API_KEY", "demo_key")
    
    async def _get_session(self):
        """Get or create aiohttp session"""
        if self.session is None:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def get_weather_data(self, location: str) -> ToolResult:
        """Get weather data for a location"""
        try:
            session = await self._get_session()
            
            # Simulate weather data for demo purposes
            # In production, you'd use a real weather API
            weather_data = {
                "location": location,
                "temperature": random.uniform(20, 35),
                "humidity": random.uniform(40, 80),
                "precipitation": random.uniform(0, 10),
                "wind_speed": random.uniform(0, 15),
                "forecast": [
                    {"day": "Today", "temp": random.uniform(20, 35), "condition": "Sunny"},
                    {"day": "Tomorrow", "temp": random.uniform(18, 32), "condition": "Partly Cloudy"},
                    {"day": "Day 3", "temp": random.uniform(22, 30), "condition": "Light Rain"}
                ]
            }
            
            return ToolResult(
                success=True,
                data=weather_data,
                metadata={"source": "weather_api", "location": location},
                confidence=0.9
            )
        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Weather tool error: {str(e)}",
                metadata={"source": "weather_api"},
                confidence=0.1
            )
    
    async def get_soil_data(self, location: str) -> ToolResult:
        """Get soil data for a location"""
        try:
            # Simulate soil data
            soil_data = {
                "location": location,
                "ph_level": random.uniform(5.5, 7.5),
                "nitrogen": random.uniform(10, 50),
                "phosphorus": random.uniform(5, 30),
                "potassium": random.uniform(15, 40),
                "organic_matter": random.uniform(1, 5),
                "soil_type": random.choice(["Clay", "Loam", "Sandy", "Silt"]),
                "moisture": random.uniform(20, 60)
            }
            
            return ToolResult(
                success=True,
                data=soil_data,
                metadata={"source": "soil_api", "location": location},
                confidence=0.85
            )
        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Soil tool error: {str(e)}",
                metadata={"source": "soil_api"},
                confidence=0.1
            )
    
    async def search_agricultural_database(self, query: str) -> ToolResult:
        """Search agricultural knowledge database"""
        try:
            # Simulate agricultural database search
            search_results = {
                "query": query,
                "results": [
                    {
                        "title": f"Research on {query}",
                        "summary": f"Latest findings about {query} in agricultural context",
                        "source": "Agricultural Research Journal",
                        "relevance_score": random.uniform(0.7, 1.0)
                    },
                    {
                        "title": f"Best Practices for {query}",
                        "summary": f"Proven methods for managing {query}",
                        "source": "Extension Service",
                        "relevance_score": random.uniform(0.6, 0.9)
                    }
                ],
                "total_results": random.randint(5, 20)
            }
            
            return ToolResult(
                success=True,
                data=search_results,
                metadata={"source": "agricultural_db"},
                confidence=0.8
            )
        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Database search error: {str(e)}",
                metadata={"source": "agricultural_db"},
                confidence=0.1
            )
    
    async def get_market_prices(self, crop: str, location: str) -> ToolResult:
        """Get current market prices for crops"""
        try:
            # Simulate market price data
            market_data = {
                "crop": crop,
                "location": location,
                "current_price": random.uniform(10, 100),
                "price_unit": "per kg",
                "trend": random.choice(["rising", "falling", "stable"]),
                "price_change": random.uniform(-10, 15),
                "demand_level": random.choice(["high", "medium", "low"]),
                "supply_level": random.choice(["high", "medium", "low"])
            }
            
            return ToolResult(
                success=True,
                data=market_data,
                metadata={"source": "market_api", "crop": crop, "location": location},
                confidence=0.75
            )
        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Market tool error: {str(e)}",
                metadata={"source": "market_api"},
                confidence=0.1
            )
    
    async def get_pesticide_info(self, disease: str, crop: str) -> ToolResult:
        """Get pesticide information for specific disease and crop"""
        try:
            # Simulate pesticide database
            pesticides = [
                {
                    "name": f"EcoSafe {disease} Control",
                    "type": "Organic",
                    "effectiveness": random.uniform(0.7, 0.9),
                    "safety_level": "Low toxicity",
                    "application_rate": "2-3 ml per liter",
                    "waiting_period": "3 days",
                    "price_range": "₹200-500 per liter"
                },
                {
                    "name": f"ChemGuard {disease} Fighter",
                    "type": "Chemical",
                    "effectiveness": random.uniform(0.8, 0.95),
                    "safety_level": "Moderate toxicity",
                    "application_rate": "1-2 ml per liter",
                    "waiting_period": "7 days",
                    "price_range": "₹150-300 per liter"
                }
            ]
            
            return ToolResult(
                success=True,
                data={"disease": disease, "crop": crop, "pesticides": pesticides},
                metadata={"source": "pesticide_db"},
                confidence=0.85
            )
        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Pesticide tool error: {str(e)}",
                metadata={"source": "pesticide_db"},
                confidence=0.1
            )
    
    async def get_local_experts(self, crop: str, disease: str, location: str) -> ToolResult:
        """Find local agricultural experts"""
        try:
            # Simulate expert database
            experts = [
                {
                    "name": "Dr. Rajesh Kumar",
                    "specialization": f"{crop} diseases",
                    "location": location,
                    "contact": "+91-9876543210",
                    "experience": "15 years",
                    "rating": random.uniform(4.0, 5.0),
                    "availability": "Weekdays 9 AM - 5 PM"
                },
                {
                    "name": "Kisan Seva Center",
                    "specialization": "General agriculture",
                    "location": f"Near {location}",
                    "contact": "+91-8765432109",
                    "experience": "10 years",
                    "rating": random.uniform(3.5, 4.5),
                    "availability": "Daily 8 AM - 6 PM"
                }
            ]
            
            return ToolResult(
                success=True,
                data={"crop": crop, "disease": disease, "experts": experts},
                metadata={"source": "expert_db"},
                confidence=0.8
            )
        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Expert search error: {str(e)}",
                metadata={"source": "expert_db"},
                confidence=0.1
            )
    
    async def get_government_schemes(self, crop: str, disease: str) -> ToolResult:
        """Get relevant government schemes"""
        try:
            # Simulate government scheme database
            schemes = [
                {
                    "name": "PM-KISAN",
                    "description": "Direct income support for farmers",
                    "eligibility": "Small and marginal farmers",
                    "benefit": "₹6000 per year",
                    "relevance": "General support"
                },
                {
                    "name": "Crop Insurance Scheme",
                    "description": "Insurance against crop damage",
                    "eligibility": "All farmers",
                    "benefit": "Up to 90% premium subsidy",
                    "relevance": f"Protection against {disease} damage"
                }
            ]
            
            return ToolResult(
                success=True,
                data={"crop": crop, "disease": disease, "schemes": schemes},
                metadata={"source": "govt_schemes_db"},
                confidence=0.9
            )
        except Exception as e:
            return ToolResult(
                success=False,
                error=f"Scheme search error: {str(e)}",
                metadata={"source": "govt_schemes_db"},
                confidence=0.1
            )
    
    async def close(self):
        """Close the aiohttp session"""
        if self.session:
            await self.session.close() 