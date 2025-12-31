# agents/agentic_memory.py
import json
import os
import datetime
import sqlite3
import threading
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import pickle

@dataclass
class AgentMemory:
    agent_id: str
    timestamp: str
    context: Dict[str, Any]
    action_taken: str
    outcome: Dict[str, Any]
    confidence: float
    user_feedback: Optional[Dict[str, Any]] = None
    success_score: Optional[float] = None

class AgenticMemoryManager:
    def __init__(self, db_path: str = "agentic_memory.db"):
        self.db_path = db_path
        self.lock = threading.Lock()
        self._init_database()
    
    def _init_database(self):
        """Initialize the agentic memory database"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS agentic_memories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    agent_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    context TEXT NOT NULL,
                    action_taken TEXT NOT NULL,
                    outcome TEXT NOT NULL,
                    confidence REAL NOT NULL,
                    user_feedback TEXT,
                    success_score REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_agentic_agent_id ON agentic_memories(agent_id)
            """)
            
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_agentic_timestamp ON agentic_memories(timestamp)
            """)
            
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_agentic_success ON agentic_memories(success_score)
            """)
    
    def store_memory(self, memory: AgentMemory):
        """Store agent memory in database"""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("""
                    INSERT INTO agentic_memories 
                    (agent_id, timestamp, context, action_taken, outcome, confidence, user_feedback, success_score)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    memory.agent_id,
                    memory.timestamp,
                    json.dumps(memory.context),
                    memory.action_taken,
                    json.dumps(memory.outcome),
                    memory.confidence,
                    json.dumps(memory.user_feedback) if memory.user_feedback else None,
                    memory.success_score
                ))
    
    def retrieve_memories(self, agent_id: str, limit: int = 10) -> List[AgentMemory]:
        """Retrieve recent memories for an agent"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("""
                SELECT agent_id, timestamp, context, action_taken, outcome, confidence, user_feedback, success_score
                FROM agentic_memories 
                WHERE agent_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
            """, (agent_id, limit))
            
            memories = []
            for row in cursor.fetchall():
                memory = AgentMemory(
                    agent_id=row[0],
                    timestamp=row[1],
                    context=json.loads(row[2]),
                    action_taken=row[3],
                    outcome=json.loads(row[4]),
                    confidence=row[5],
                    user_feedback=json.loads(row[6]) if row[6] else None,
                    success_score=row[7]
                )
                memories.append(memory)
            
            return memories
    
    def get_similar_contexts(self, context: Dict[str, Any], limit: int = 5) -> List[AgentMemory]:
        """Find memories with similar contexts using keyword matching"""
        context_str = json.dumps(context).lower()
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("""
                SELECT agent_id, timestamp, context, action_taken, outcome, confidence, user_feedback, success_score
                FROM agentic_memories 
                WHERE LOWER(context) LIKE ?
                ORDER BY success_score DESC, timestamp DESC
                LIMIT ?
            """, (f"%{context_str}%", limit))
            
            memories = []
            for row in cursor.fetchall():
                memory = AgentMemory(
                    agent_id=row[0],
                    timestamp=row[1],
                    context=json.loads(row[2]),
                    action_taken=row[3],
                    outcome=json.loads(row[4]),
                    confidence=row[5],
                    user_feedback=json.loads(row[6]) if row[6] else None,
                    success_score=row[7]
                )
                memories.append(memory)
            
            return memories
    
    def get_agent_performance(self, agent_id: str, days: int = 30) -> Dict[str, Any]:
        """Get performance statistics for an agent"""
        cutoff_date = (datetime.datetime.utcnow() - datetime.timedelta(days=days)).isoformat()
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("""
                SELECT 
                    COUNT(*) as total_actions,
                    AVG(confidence) as avg_confidence,
                    AVG(success_score) as avg_success,
                    COUNT(CASE WHEN success_score > 0.7 THEN 1 END) as successful_actions
                FROM agentic_memories 
                WHERE agent_id = ? AND timestamp > ?
            """, (agent_id, cutoff_date))
            
            row = cursor.fetchone()
            if row and row[0] > 0:
                return {
                    "total_actions": row[0],
                    "avg_confidence": row[1] or 0,
                    "avg_success": row[2] or 0,
                    "success_rate": (row[3] / row[0]) if row[0] > 0 else 0
                }
            else:
                return {
                    "total_actions": 0,
                    "avg_confidence": 0,
                    "avg_success": 0,
                    "success_rate": 0
                }
    
    def update_success_score(self, memory_id: int, success_score: float):
        """Update the success score for a memory"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                UPDATE agentic_memories 
                SET success_score = ?
                WHERE id = ?
            """, (success_score, memory_id)) 