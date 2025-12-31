# agents/agentic_base.py
import asyncio
import json
import datetime
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from .agentic_memory import AgenticMemoryManager, AgentMemory
from .agentic_tools import AgenticToolRegistry, ToolResult
from .llm_client import get_llm_response

@dataclass
class AgentGoal:
    description: str
    priority: int  # 1-10, higher is more important
    status: str  # "pending", "in_progress", "completed", "failed"
    created_at: str
    completed_at: Optional[str] = None
    progress: float = 0.0  # 0.0 to 1.0

@dataclass
class AgentTool:
    name: str
    description: str
    function: callable
    parameters: Dict[str, Any]
    confidence: float = 0.8

class AgenticBaseAgent(ABC):
    def __init__(self, agent_id: str, memory_manager: AgenticMemoryManager, tool_registry: AgenticToolRegistry):
        self.agent_id = agent_id
        self.memory_manager = memory_manager
        self.tool_registry = tool_registry
        self.goals: List[AgentGoal] = []
        self.tools: Dict[str, AgentTool] = {}
        self.context: Dict[str, Any] = {}
        self.learning_rate = 0.1
        self.confidence_threshold = 0.7
        self.performance_history: List[Dict[str, Any]] = []
        
        # Register default tools
        self._register_default_tools()
    
    def _register_default_tools(self):
        """Register default tools available to all agents"""
        self.register_tool(
            AgentTool(
                name="search_memory",
                description="Search agent's memory for similar past experiences",
                function=self._search_memory_tool,
                parameters={"query": "string", "limit": "int"},
                confidence=0.9
            )
        )
        
        self.register_tool(
            AgentTool(
                name="update_goal",
                description="Update the status of a goal",
                function=self._update_goal_tool,
                parameters={"goal_index": "int", "status": "string", "progress": "float"},
                confidence=0.95
            )
        )
        
        self.register_tool(
            AgentTool(
                name="analyze_performance",
                description="Analyze agent's recent performance",
                function=self._analyze_performance_tool,
                parameters={"days": "int"},
                confidence=0.8
            )
        )
    
    def register_tool(self, tool: AgentTool):
        """Register a new tool for the agent"""
        self.tools[tool.name] = tool
    
    def add_goal(self, description: str, priority: int = 5) -> int:
        """Add a new goal for the agent"""
        goal = AgentGoal(
            description=description,
            priority=priority,
            status="pending",
            created_at=datetime.datetime.utcnow().isoformat(),
            progress=0.0
        )
        self.goals.append(goal)
        return len(self.goals) - 1  # Return goal index
    
    def get_pending_goals(self) -> List[AgentGoal]:
        """Get all pending goals sorted by priority"""
        return sorted(
            [goal for goal in self.goals if goal.status == "pending"],
            key=lambda x: x.priority,
            reverse=True
        )
    
    async def plan_actions(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Plan actions based on current context and goals"""
        pending_goals = self.get_pending_goals()
        if not pending_goals:
            return []
        
        # Get recent memories for context
        recent_memories = self.memory_manager.retrieve_memories(self.agent_id, limit=5)
        memory_context = ""
        if recent_memories:
            memory_context = "\nRecent Experiences:\n" + "\n".join([
                f"- {memory.action_taken}: {memory.outcome.get('success', 'unknown')}"
                for memory in recent_memories[:3]
            ])
        
        # Create planning prompt
        goals_text = "\n".join([f"{i+1}. {goal.description} (Priority: {goal.priority})" 
                               for i, goal in enumerate(pending_goals)])
        
        available_tools = "\n".join([f"- {name}: {tool.description} (Confidence: {tool.confidence})" 
                                   for name, tool in self.tools.items()])
        
        prompt = f"""
        You are an AI agent planning actions to achieve goals. Analyze the current context, goals, and available tools to create an intelligent plan.
        
        Current Context: {json.dumps(context, indent=2)}
        
        Pending Goals:
        {goals_text}
        
        Available Tools:
        {available_tools}
        
        {memory_context}
        
        Create a JSON plan with the following structure:
        {{
            "actions": [
                {{
                    "tool": "tool_name",
                    "parameters": {{"param1": "value1"}},
                    "reasoning": "Why this action is needed",
                    "expected_outcome": "What this action should achieve",
                    "estimated_confidence": 0.85,
                    "priority": 1
                }}
            ],
            "priority_order": [1, 2, 3, ...],
            "overall_confidence": 0.85,
            "estimated_time": "estimated time to complete",
            "risk_assessment": "low/medium/high"
        }}
        
        Consider:
        1. Goal priorities
        2. Tool confidence levels
        3. Past experiences
        4. Current context
        5. Resource efficiency
        """
        
        try:
            response = await get_llm_response(prompt, f"{self.agent_id}_planner")
            if "error" not in response:
                return response.get("actions", [])
        except Exception as e:
            print(f"Planning error for {self.agent_id}: {e}")
        
        return []
    
    async def execute_action(self, action: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a planned action using available tools"""
        tool_name = action.get("tool")
        parameters = action.get("parameters", {})
        
        if tool_name not in self.tools:
            return {"error": f"Tool {tool_name} not found"}
        
        try:
            tool = self.tools[tool_name]
            
            # Execute the tool
            if asyncio.iscoroutinefunction(tool.function):
                result = await tool.function(**parameters)
            else:
                result = await asyncio.to_thread(tool.function, **parameters)
            
            # Calculate success score based on result
            success_score = self._calculate_success_score(result, action.get("expected_outcome"))
            
            # Store memory of this action
            memory = AgentMemory(
                agent_id=self.agent_id,
                timestamp=datetime.datetime.utcnow().isoformat(),
                context=self.context.copy(),
                action_taken=f"Used {tool_name} with {parameters}",
                outcome=result,
                confidence=action.get("estimated_confidence", tool.confidence),
                success_score=success_score
            )
            self.memory_manager.store_memory(memory)
            
            # Update performance history
            self.performance_history.append({
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "action": tool_name,
                "success_score": success_score,
                "confidence": action.get("estimated_confidence", tool.confidence)
            })
            
            return {
                "success": True,
                "result": result,
                "success_score": success_score,
                "tool_used": tool_name
            }
        except Exception as e:
            return {"error": f"Action execution failed: {str(e)}", "success": False}
    
    def _calculate_success_score(self, result: Any, expected_outcome: str) -> float:
        """Calculate success score based on result and expected outcome"""
        if isinstance(result, dict):
            if "error" in result:
                return 0.1
            elif "success" in result and result["success"]:
                return 0.9
            elif "confidence" in result:
                return result["confidence"]
        
        # Simple heuristic based on result type
        if result and not isinstance(result, str):
            return 0.8
        elif result and "error" not in str(result).lower():
            return 0.7
        else:
            return 0.3
    
    async def learn_from_experience(self, context: Dict[str, Any], outcomes: List[Dict[str, Any]]):
        """Learn from experience and update agent behavior"""
        if not outcomes:
            return
        
        # Calculate average success rate
        success_scores = [outcome.get("success_score", 0) for outcome in outcomes if outcome.get("success_score")]
        if not success_scores:
            return
        
        avg_success = sum(success_scores) / len(success_scores)
        
        # Update confidence threshold based on success rate
        if avg_success > 0.8:
            self.confidence_threshold = min(0.9, self.confidence_threshold + self.learning_rate)
        elif avg_success < 0.3:
            self.confidence_threshold = max(0.3, self.confidence_threshold - self.learning_rate)
        
        # Update learning rate
        if avg_success < 0.5:
            self.learning_rate = min(0.3, self.learning_rate + 0.05)
        else:
            self.learning_rate = max(0.05, self.learning_rate - 0.02)
        
        # Find similar past experiences for pattern learning
        similar_memories = self.memory_manager.get_similar_contexts(context, limit=3)
        if similar_memories:
            # Analyze patterns and update tool confidences
            for memory in similar_memories:
                if memory.success_score and memory.success_score > 0.7:
                    # Increase confidence for successful tools
                    tool_name = memory.action_taken.split()[1] if len(memory.action_taken.split()) > 1 else ""
                    if tool_name in self.tools:
                        self.tools[tool_name].confidence = min(0.95, self.tools[tool_name].confidence + 0.05)
    
    def _search_memory_tool(self, query: str, limit: int = 5) -> Dict[str, Any]:
        """Tool for searching agent memory"""
        memories = self.memory_manager.retrieve_memories(self.agent_id, limit)
        return {
            "query": query,
            "results": [{"action": m.action_taken, "outcome": m.outcome, "success_score": m.success_score} for m in memories],
            "count": len(memories)
        }
    
    def _update_goal_tool(self, goal_index: int, status: str, progress: float = 0.0) -> Dict[str, Any]:
        """Tool for updating goal status"""
        if 0 <= goal_index < len(self.goals):
            self.goals[goal_index].status = status
            self.goals[goal_index].progress = progress
            if status == "completed":
                self.goals[goal_index].completed_at = datetime.datetime.utcnow().isoformat()
            return {"success": True, "goal_updated": {
                "description": self.goals[goal_index].description,
                "status": status,
                "progress": progress
            }}
        return {"error": "Invalid goal index"}
    
    def _analyze_performance_tool(self, days: int = 30) -> Dict[str, Any]:
        """Tool for analyzing agent performance"""
        performance = self.memory_manager.get_agent_performance(self.agent_id, days)
        return {
            "performance_analysis": performance,
            "learning_rate": self.learning_rate,
            "confidence_threshold": self.confidence_threshold,
            "total_goals": len(self.goals),
            "completed_goals": len([g for g in self.goals if g.status == "completed"])
        }
    
    @abstractmethod
    async def process_request(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Main processing method that each agent must implement"""
        pass
    
    async def run_agentic_cycle(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Main agentic cycle: Plan -> Execute -> Learn"""
        self.context = context
        
        # Step 1: Plan actions
        actions = await self.plan_actions(context)
        
        if not actions:
            # Fallback to traditional processing
            return await self.process_request(context)
        
        # Step 2: Execute actions with confidence filtering
        results = []
        executed_actions = []
        
        for action in actions:
            if action.get("estimated_confidence", 0) >= self.confidence_threshold:
                result = await self.execute_action(action)
                results.append(result)
                executed_actions.append(action)
            else:
                print(f"Action {action.get('tool')} skipped due to low confidence: {action.get('estimated_confidence')}")
        
        # Step 3: Learn from experience
        await self.learn_from_experience(context, results)
        
        # Step 4: Generate final response
        final_response = await self._synthesize_results(results, context)
        
        return {
            "agent_id": self.agent_id,
            "actions_planned": len(actions),
            "actions_executed": len(executed_actions),
            "results": results,
            "final_response": final_response,
            "confidence": sum(action.get("estimated_confidence", 0) for action in executed_actions) / len(executed_actions) if executed_actions else 0,
            "learning_applied": True
        }
    
    async def _synthesize_results(self, results: List[Dict[str, Any]], context: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesize results from multiple actions into a coherent response"""
        if not results:
            return await self.process_request(context)
        
        # Combine all successful results
        successful_results = [r for r in results if r.get("success")]
        
        if not successful_results:
            return await self.process_request(context)
        
        # Create synthesis prompt
        results_summary = "\n".join([
            f"Tool: {r.get('tool_used', 'unknown')}, Success: {r.get('success_score', 0):.2f}, Result: {str(r.get('result', {}))}"
            for r in successful_results
        ])
        
        prompt = f"""
        Synthesize the following agent results into a coherent, helpful response for the user:
        
        Context: {json.dumps(context, indent=2)}
        
        Agent Results:
        {results_summary}
        
        Create a comprehensive response that:
        1. Integrates all relevant information
        2. Provides actionable recommendations
        3. Addresses the user's original request
        4. Includes confidence levels and sources
        
        Return as JSON with structure:
        {{
            "synthesized_response": {{...}},
            "confidence": 0.85,
            "sources": ["source1", "source2"],
            "recommendations": ["rec1", "rec2"]
        }}
        """
        
        try:
            synthesis = await get_llm_response(prompt, f"{self.agent_id}_synthesizer")
            if "error" not in synthesis:
                return synthesis
        except Exception as e:
            print(f"Synthesis error: {e}")
        
        # Fallback: return the first successful result
        return successful_results[0].get("result", {}) 