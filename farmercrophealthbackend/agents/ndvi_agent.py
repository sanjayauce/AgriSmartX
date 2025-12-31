# agents/ndvi_agent.py

import random
import asyncio
from typing import Dict, Any, List
from .agentic_base import AgenticBaseAgent, AgentTool
from .llm_client import get_llm_response

class NDVIAgent(AgenticBaseAgent):
    """
    NDVI (Normalized Difference Vegetation Index) Agent
    Provides vegetation health analysis based on simulated NDVI calculations
    """
    
    def __init__(self, memory_manager, tool_registry):
        super().__init__(
            agent_id="ndvi_agent",
            memory_manager=memory_manager,
            tool_registry=tool_registry
        )
        
        # Set NDVI-specific properties
        self.agent_name = "NDVI Vegetation Health Analyzer"
        self.confidence_threshold = 0.7
        self.learning_rate = 0.1
        
        # Register NDVI-specific tools
        self.register_tool(
            AgentTool(
                name="calculate_ndvi",
                description="Calculate NDVI score based on crop health",
                function=self._calculate_ndvi_score_simple,
                parameters={"crop": "string", "disease": "string", "is_healthy": "boolean"},
                confidence=0.9
            )
        )
        
        self.register_tool(
            AgentTool(
                name="analyze_vegetation_health",
                description="Analyze vegetation health based on NDVI score",
                function=self._analyze_vegetation_health_simple,
                parameters={"ndvi_data": "dict", "crop": "string", "disease": "string"},
                confidence=0.85
            )
        )
        
        self.register_tool(
            AgentTool(
                name="generate_health_report",
                description="Generate comprehensive vegetation health report",
                function=self._generate_health_report_simple,
                parameters={"ndvi_data": "dict", "health_analysis": "dict", "context": "dict"},
                confidence=0.8
            )
        )
    
    async def process_request(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process the request to generate comprehensive NDVI analysis without LLM
        """
        crop = context.get("crop", "Unknown")
        disease = context.get("disease", "healthy")
        is_healthy = context.get("is_healthy", False)
        confidence = context.get("confidence", "70%")
        
        # Calculate NDVI score based on health
        ndvi_score = self._calculate_ndvi_score_simple(crop, disease, is_healthy)
        
        # Analyze vegetation health
        health_analysis = self._analyze_vegetation_health_simple(ndvi_score, crop, disease)
        
        # Generate comprehensive report without LLM
        report = self._generate_health_report_simple(ndvi_score, health_analysis, context)
        
        return {
            "ndvi_score": ndvi_score,
            "vegetation_health": health_analysis,
            "comprehensive_report": report,
            "confidence": 0.85,
            "analysis_timestamp": context.get("timestamp")
        }
    
    def _calculate_ndvi_score_simple(self, crop: str, disease: str, is_healthy: bool) -> Dict[str, Any]:
        """Calculate NDVI score based on crop health without LLM"""
        if is_healthy:
            ndvi_score = round(random.uniform(0.75, 0.90), 3)
            health_status = "Excellent"
            interpretation = "Vigorous, healthy vegetation with optimal chlorophyll content"
        else:
            # Adjust NDVI based on disease severity
            if "severe" in disease.lower() or "blight" in disease.lower():
                ndvi_score = round(random.uniform(0.15, 0.35), 3)
                health_status = "Severely Stressed"
                interpretation = "Significantly reduced vegetation vigor due to severe disease impact"
            elif "bacterial" in disease.lower():
                ndvi_score = round(random.uniform(0.25, 0.45), 3)
                health_status = "Moderately Stressed"
                interpretation = "Reduced vegetation vigor indicating bacterial infection stress"
            elif "fungal" in disease.lower():
                ndvi_score = round(random.uniform(0.30, 0.50), 3)
                health_status = "Stressed"
                interpretation = "Fungal disease affecting leaf efficiency and chlorophyll content"
            else:
                ndvi_score = round(random.uniform(0.20, 0.50), 3)
                health_status = "Stressed"
                interpretation = "Reduced vegetation vigor indicating stress, disease, or nutrient deficiency"
        
        return {
            "score": ndvi_score,
            "health_status": health_status,
            "interpretation": interpretation,
            "scale": "0.0 (no vegetation) to 1.0 (dense healthy vegetation)",
            "color_code": self._get_ndvi_color_code(ndvi_score)
        }
    
    def _analyze_vegetation_health_simple(self, ndvi_data: Dict[str, Any], crop: str, disease: str) -> Dict[str, Any]:
        """Analyze vegetation health based on NDVI score without LLM"""
        score = ndvi_data["score"]
        
        if score >= 0.7:
            health_level = "Excellent"
            recommendations = [
                "Maintain current management practices",
                "Continue monitoring for early signs of stress",
                "Consider optimal harvest timing based on peak NDVI"
            ]
            monitoring_frequency = "Weekly monitoring sufficient"
        elif score >= 0.5:
            health_level = "Good"
            recommendations = [
                "Monitor for potential stress factors",
                "Ensure adequate irrigation and nutrition",
                "Consider preventive treatments"
            ]
            monitoring_frequency = "Every 3-4 days"
        elif score >= 0.3:
            health_level = "Moderate Stress"
            recommendations = [
                "Implement immediate stress mitigation",
                "Check for disease, pests, or nutrient deficiencies",
                "Consider treatment options"
            ]
            monitoring_frequency = "Every 2-3 days"
        else:
            health_level = "Severe Stress"
            recommendations = [
                "Immediate intervention required",
                "Assess root causes of stress",
                "Consider crop replacement if necessary"
            ]
            monitoring_frequency = "Daily monitoring recommended"
        
        return {
            "health_level": health_level,
            "stress_factors": self._identify_stress_factors_simple(score, disease),
            "recommendations": recommendations,
            "monitoring_schedule": monitoring_frequency,
            "risk_level": self._get_risk_level(score)
        }
    
    def _generate_health_report_simple(self, ndvi_data: Dict[str, Any], health_analysis: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive vegetation health report without LLM"""
        crop = context.get("crop", "Unknown")
        disease = context.get("disease", "healthy")
        
        return {
            "vegetation_assessment": {
                "overall_health": ndvi_data["health_status"],
                "ndvi_interpretation": ndvi_data["interpretation"],
                "health_level": health_analysis["health_level"],
                "crop_specific_notes": f"NDVI analysis for {crop} indicates {ndvi_data['health_status'].lower()} vegetation health"
            },
            "stress_analysis": {
                "primary_factors": health_analysis["stress_factors"],
                "severity": "High" if ndvi_data["score"] < 0.4 else "Moderate" if ndvi_data["score"] < 0.6 else "Low",
                "risk_level": health_analysis["risk_level"]
            },
            "management_recommendations": {
                "immediate_actions": health_analysis["recommendations"],
                "long_term_strategy": [
                    "Implement regular NDVI monitoring program",
                    "Develop stress prevention protocols",
                    "Establish baseline NDVI values for healthy crops"
                ]
            },
            "monitoring_guidelines": {
                "frequency": health_analysis["monitoring_schedule"],
                "key_indicators": [
                    "NDVI score changes over time",
                    "Visual symptoms correlation",
                    "Growth pattern analysis"
                ],
                "alert_thresholds": {
                    "critical": "NDVI < 0.3",
                    "warning": "NDVI < 0.5",
                    "optimal": "NDVI > 0.7"
                }
            },
            "recovery_timeline": {
                "expected_improvement": "2-4 weeks with proper treatment" if ndvi_data["score"] < 0.6 else "Maintain current health",
                "full_recovery": "6-8 weeks for complete vegetation restoration" if ndvi_data["score"] < 0.6 else "Ongoing maintenance",
                "monitoring_milestones": [
                    "Week 1: Initial treatment assessment",
                    "Week 2: NDVI score re-evaluation",
                    "Week 4: Progress assessment",
                    "Week 8: Full recovery evaluation"
                ]
            },
            "confidence": 0.85
        }
    
    def _identify_stress_factors_simple(self, ndvi_score: float, disease: str) -> List[str]:
        """Identify potential stress factors based on NDVI score and disease"""
        factors = []
        
        if ndvi_score < 0.4:
            factors.extend(["Severe disease impact", "Nutrient deficiency", "Water stress"])
        elif ndvi_score < 0.6:
            factors.extend(["Moderate disease stress", "Suboptimal growing conditions"])
        
        # Disease-specific factors
        if "bacterial" in disease.lower():
            factors.append("Bacterial infection affecting photosynthesis")
        elif "fungal" in disease.lower():
            factors.append("Fungal disease reducing leaf efficiency")
        elif "viral" in disease.lower():
            factors.append("Viral infection causing systemic stress")
        elif "blight" in disease.lower():
            factors.append("Blight disease causing rapid tissue damage")
        elif "spot" in disease.lower():
            factors.append("Leaf spot disease reducing photosynthetic area")
        
        return factors
    
    def _get_ndvi_color_code(self, ndvi_score: float) -> str:
        """Get color code for NDVI visualization"""
        if ndvi_score >= 0.7:
            return "#28a745"  # Green - Excellent
        elif ndvi_score >= 0.5:
            return "#ffc107"  # Yellow - Good
        elif ndvi_score >= 0.3:
            return "#fd7e14"  # Orange - Moderate Stress
        else:
            return "#dc3545"  # Red - Severe Stress
    
    def _get_risk_level(self, ndvi_score: float) -> str:
        """Get risk level based on NDVI score"""
        if ndvi_score >= 0.7:
            return "Low"
        elif ndvi_score >= 0.5:
            return "Moderate"
        elif ndvi_score >= 0.3:
            return "High"
        else:
            return "Critical"

# Legacy function for backward compatibility
def get_ndvi_analysis(class_name: str) -> dict:
    """
    Simulates an NDVI (Normalized Difference Vegetation Index) score based on the health of the plant.
    In a real-world scenario, this would involve processing near-infrared and red light data from a specialized camera.
    
    NDVI values range from -1 to +1.
    - Healthy vegetation: 0.5 to 0.9
    - Stressed/unhealthy vegetation: 0.1 to 0.4
    - Non-vegetation (water, soil): < 0.1
    """
    disease = class_name.split('___')[1] if '___' in class_name else class_name
    is_healthy = "healthy" in disease.lower()

    if is_healthy:
        # Simulate a high NDVI score for healthy plants
        ndvi_score = round(random.uniform(0.75, 0.90), 2)
        interpretation = "The plant appears to have vigorous, healthy vegetation."
    else:
        # Simulate a lower NDVI score for stressed or diseased plants
        ndvi_score = round(random.uniform(0.20, 0.50), 2)
        interpretation = "The plant shows signs of stress, which could indicate disease or nutrient deficiency."

    return {
        "title": "Vegetation Index Analysis (Simulated NDVI)",
        "score": ndvi_score,
        "interpretation": interpretation,
        "details": "This NDVI score is a simulation based on the visual prediction. Higher values typically correlate with denser, healthier vegetation."
    } 