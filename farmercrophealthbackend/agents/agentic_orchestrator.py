# agents/agentic_orchestrator.py
import asyncio
import datetime
import json
from typing import Dict, Any, List, Optional
from .agentic_memory import AgenticMemoryManager
from .agentic_tools import AgenticToolRegistry
from .agentic_advisor import AgenticAdvisorAgent
from .agentic_base import AgenticBaseAgent
from .sustainability_agent import SustainabilityAgent
from .community_agent import CommunityAgent
from .ndvi_agent import NDVIAgent

class AgenticOrchestrator:
    def __init__(self):
        self.memory_manager = AgenticMemoryManager()
        self.tool_registry = AgenticToolRegistry()
        self.agents: Dict[str, AgenticBaseAgent] = {}
        self.coordination_history: List[Dict[str, Any]] = []
        self.conflict_resolution_strategies = {
            "treatment_conflict": self._resolve_treatment_conflict,
            "product_conflict": self._resolve_product_conflict,
            "timing_conflict": self._resolve_timing_conflict
        }
        
        # Agents will be initialized on-demand per request
        # self._initialize_agents()
    
    def _initialize_agents(self):
        """Initialize all agentic agents"""
        self.agents["advisor"] = AgenticAdvisorAgent(self.memory_manager, self.tool_registry)
        self.agents["sustainability"] = SustainabilityAgent(self.memory_manager, self.tool_registry)
        self.agents["community"] = CommunityAgent(self.memory_manager, self.tool_registry)
        self.agents["ndvi"] = NDVIAgent(self.memory_manager, self.tool_registry)
    
    async def coordinate_agentic_agents(self, class_name: str, confidence: str, user_info: Dict[str, Any]) -> Dict[str, Any]:
        """Coordinate multiple agentic agents with intelligent decision-making"""
        
        # Initialize agents for the current request to ensure a clean state
        self._initialize_agents()

        # Parse crop and disease
        try:
            crop, disease = class_name.split('___', 1)
            disease = disease.replace('_', ' ')
            crop = crop.replace('_', ' ')
        except ValueError:
            crop = "Unknown"
            disease = class_name.replace('_', ' ')
        
        # Create shared context
        shared_context = {
            "crop": crop,
            "disease": disease,
            "confidence": confidence,
            "user_info": user_info,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "is_healthy": "healthy" in disease.lower(),
            "session_id": f"session_{datetime.datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        }
        
        # Determine which agents to activate based on context and agent capabilities
        active_agents = await self._determine_active_agents(shared_context)
        
        # Run agents with intelligent coordination
        agent_results = {}
        coordination_tasks = []
        
        for agent_name in active_agents:
            agent = self.agents.get(agent_name)
            if agent:
                # Create agent-specific context
                agent_context = shared_context.copy()
                agent_context["agent_role"] = agent_name
                agent_context["agent_capabilities"] = self._get_agent_capabilities(agent)
                
                # Run agent asynchronously
                task = asyncio.create_task(
                    self._run_agent_with_coordination(agent, agent_context)
                )
                coordination_tasks.append((agent_name, task))
        
        # Wait for all agents to complete
        for agent_name, task in coordination_tasks:
            try:
                result = await task
                agent_results[agent_name] = result
                print(f"✅ {agent_name} agent completed successfully")
            except Exception as e:
                agent_results[agent_name] = {"error": f"Agent {agent_name} failed: {str(e)}"}
                print(f"❌ {agent_name} agent failed: {str(e)}")
        
        # Analyze results and detect conflicts
        conflicts = await self._detect_conflicts(agent_results, shared_context)
        
        # Resolve conflicts if any
        if conflicts:
            resolved_results = await self._resolve_conflicts(conflicts, agent_results, shared_context)
        else:
            resolved_results = agent_results
        
        # Coordinate results and create final response
        coordinated_response = await self._create_coordinated_response(resolved_results, shared_context)
        
        # Store coordination history for learning
        self.coordination_history.append({
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "context": shared_context,
            "active_agents": active_agents,
            "results": agent_results,
            "conflicts": conflicts,
            "final_response": coordinated_response
        })
        
        return coordinated_response
    
    async def _determine_active_agents(self, context: Dict[str, Any]) -> List[str]:
        """Intelligently determine which agents to activate."""
        # For this enhanced experience, we will activate all agents.
        # In a more complex system, this logic could be based on user preferences,
        # subscription tiers, or specific problem characteristics.
        return list(self.agents.keys())
    
    def _get_agent_capabilities(self, agent: AgenticBaseAgent) -> Dict[str, Any]:
        """Get agent capabilities for coordination"""
        return {
            "tools": list(agent.tools.keys()),
            "confidence_threshold": agent.confidence_threshold,
            "learning_rate": agent.learning_rate,
            "performance": self.memory_manager.get_agent_performance(agent.agent_id, days=30)
        }
    
    async def _run_agent_with_coordination(self, agent: AgenticBaseAgent, context: Dict[str, Any]) -> Dict[str, Any]:
        """Run an agent with coordination capabilities"""
        try:
            # Check if agent has recent relevant experience
            recent_memories = self.memory_manager.retrieve_memories(agent.agent_id, limit=3)
            
            if recent_memories:
                # Add memory context
                context["recent_experience"] = [
                    {
                        "action": memory.action_taken,
                        "outcome": memory.outcome,
                        "success_score": memory.success_score
                    }
                    for memory in recent_memories
                ]
            
            # Run the agentic cycle
            result = await agent.run_agentic_cycle(context)
            
            return result
        except Exception as e:
            return {"error": f"Agent execution failed: {str(e)}"}
    
    async def _detect_conflicts(self, agent_results: Dict[str, Any], context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Detect conflicts between agent recommendations"""
        conflicts = []
        
        # Check for treatment conflicts
        treatment_recommendations = []
        for agent_name, result in agent_results.items():
            if "final_response" in result:
                response = result["final_response"]
                if "treatment_steps" in str(response) or "recommended_products" in str(response):
                    treatment_recommendations.append((agent_name, response))
        
        if len(treatment_recommendations) > 1:
            # Check for contradictory recommendations
            all_treatments = str(treatment_recommendations).lower()
            if "chemical" in all_treatments and "organic" in all_treatments:
                conflicts.append({
                    "type": "treatment_conflict",
                    "agents": [name for name, _ in treatment_recommendations],
                    "description": "Conflicting treatment approaches (chemical vs organic)",
                    "severity": "high"
                })
        
        # Check for timing conflicts
        timing_recommendations = []
        for agent_name, result in agent_results.items():
            if "final_response" in result:
                response = result["final_response"]
                if "application_timing" in str(response) or "timing" in str(response):
                    timing_recommendations.append((agent_name, response))
        
        if len(timing_recommendations) > 1:
            conflicts.append({
                "type": "timing_conflict",
                "agents": [name for name, _ in timing_recommendations],
                "description": "Conflicting timing recommendations",
                "severity": "medium"
            })
        
        return conflicts
    
    async def _resolve_conflicts(self, conflicts: List[Dict[str, Any]], agent_results: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve conflicts between agent recommendations"""
        resolved_results = agent_results.copy()
        
        for conflict in conflicts:
            conflict_type = conflict.get("type")
            if conflict_type in self.conflict_resolution_strategies:
                resolved_results = await self.conflict_resolution_strategies[conflict_type](
                    conflict, resolved_results, context
                )
        
        return resolved_results
    
    async def _resolve_treatment_conflict(self, conflict: Dict[str, Any], results: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve treatment approach conflicts"""
        # Use LLM to resolve treatment conflicts
        prompt = f"""
        Multiple agents have provided conflicting treatment recommendations for the same agricultural problem.
        Please analyze and resolve the conflict to provide a unified, safe, and effective treatment plan.
        
        Context: {json.dumps(context, indent=2)}
        
        Agent Results: {json.dumps(results, indent=2)}
        
        Conflict: {json.dumps(conflict, indent=2)}
        
        Provide a conflict resolution that:
        1. Prioritizes safety and environmental impact
        2. Considers cost-effectiveness
        3. Provides clear reasoning for the chosen approach
        4. Includes alternative options when appropriate
        
        Return as JSON with structure:
        {{
            "resolved_treatment": {{...}},
            "resolution_reasoning": "Explanation of conflict resolution",
            "confidence": 0.85,
            "safety_priority": true
        }}
        """
        
        try:
            from .llm_client import get_llm_response
            resolution = await get_llm_response(prompt, "ConflictResolver")
            if "error" not in resolution:
                # Update the advisor agent's result with resolved treatment
                if "advisor" in results:
                    results["advisor"]["final_response"] = resolution.get("resolved_treatment", {})
                    results["advisor"]["conflict_resolution"] = resolution.get("resolution_reasoning", "")
        except Exception as e:
            print(f"Conflict resolution error: {e}")
        
        return results
    
    async def _resolve_product_conflict(self, conflict: Dict[str, Any], results: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve product recommendation conflicts"""
        # Similar to treatment conflict resolution but focused on products
        return results
    
    async def _resolve_timing_conflict(self, conflict: Dict[str, Any], results: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve timing recommendation conflicts"""
        # Similar to treatment conflict resolution but focused on timing
        return results
    
    async def _create_coordinated_response(self, agent_results: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a rich, coordinated response by synthesizing the outputs from all active agents
        into a single, comprehensive report.
        """
        
        # --- Extract individual agent responses ---
        advisor_response = agent_results.get("advisor", {}).get("final_response", {})
        sustainability_response = agent_results.get("sustainability", {}).get("final_response", {})
        community_response = agent_results.get("community", {}).get("final_response", {})
        
        # Handle NDVI response - it might return directly or in final_response
        ndvi_result = agent_results.get("ndvi", {})
        ndvi_response = ndvi_result.get("final_response", ndvi_result) if ndvi_result else {}

        # --- Synthesize into a single "immense" structure ---
        final_response = {
            "report_title": f"Comprehensive Agentic AI Analysis for {context['crop']}",
            "prediction": {
                "crop": context["crop"],
                "disease": context["disease"],
                "confidence": context["confidence"],
                "is_healthy": context["is_healthy"]
            },
            
            # Part 1: Main Advisory from the expert agent
            "expert_advisor_report": advisor_response,
            
            # Part 2: Sustainability Insights
            "sustainability_insights": sustainability_response,
            
            # Part 3: Community Wisdom
            "community_wisdom": community_response,
            
            # Part 4: NDVI Vegetation Health Analysis
            "ndvi_analysis": ndvi_response,

            # Part 5: Agentic System Metadata
            "agentic_metadata": {
                "agents_used": list(agent_results.keys()),
                "total_actions": sum(res.get("actions_executed", 0) for res in agent_results.values()),
                "overall_confidence": sum(res.get("confidence", 0) for res in agent_results.values()) / len(agent_results) if agent_results else 0,
                "learning_applied": any("recent_experience" in res.get("tool_results", []) for res in agent_results.values()),
                "conflicts_resolved": 0 # Placeholder for conflict resolution logic
            },
            
            "request_info": {
                "user_id": context.get("user_info", {}).get("farmer_id", "anonymous"),
                "session_id": context["session_id"],
                "timestamp_utc": context["timestamp"]
            }
        }
        
        return final_response
    
    async def close(self):
        """Clean up resources"""
        await self.tool_registry.close() 