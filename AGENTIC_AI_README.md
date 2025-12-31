# 🤖 Agentic AI Crop Health System

## Overview

This implementation adds true agentic AI capabilities to your existing crop health backend without disturbing the current working system. The agentic AI system provides autonomous decision-making, memory, learning, and tool usage capabilities.

## 🚀 Key Features

### ✅ Agentic Capabilities
- **Autonomous Decision Making**: Agents can plan and execute actions independently
- **Memory & Learning**: Persistent memory system with learning from experience
- **Tool Usage**: Access to external APIs and data sources
- **Goal-Oriented Behavior**: Agents pursue specific objectives
- **Conflict Resolution**: Intelligent resolution of contradictory recommendations
- **Performance Adaptation**: Agents improve their behavior over time

### ✅ System Architecture
- **Modular Design**: New agentic components coexist with existing system
- **Separate Endpoints**: Original system remains unchanged
- **Memory Management**: SQLite-based persistent memory
- **Tool Registry**: Extensible tool system for external APIs
- **Orchestration**: Intelligent coordination between multiple agents

## 📁 File Structure

```
farmercrophealthbackend/
├── agents/
│   ├── agentic_memory.py          # Memory management system
│   ├── agentic_tools.py           # Tool registry for external APIs
│   ├── agentic_base.py            # Base agentic agent class
│   ├── agentic_advisor.py         # Enhanced advisor agent
│   ├── agentic_orchestrator.py    # Intelligent agent coordination
│   └── [existing files remain unchanged]
├── agentic_health.py              # New agentic endpoint
├── requirements_agentic.txt       # Additional dependencies
└── [existing files remain unchanged]

src/pages/
├── AgenticCropHealth.jsx          # New frontend component
├── AgenticCropHealth.css          # Styling for agentic UI
└── [existing files remain unchanged]
```

## 🛠️ Installation & Setup

### 1. Install Agentic Dependencies

```bash
cd farmercrophealthbackend
pip install -r requirements_agentic.txt
```

### 2. Start the Agentic AI System

```bash
# Start the agentic AI backend (runs on port 5003)
python agentic_health.py
```

### 3. Access the Agentic Frontend

The agentic AI system is available as a separate component in your React app. You can add it to your routing:

```jsx
// In your App.jsx or routing configuration
import AgenticCropHealth from './pages/AgenticCropHealth';

// Add route
<Route path="/agentic-crop-health" element={<AgenticCropHealth />} />
```

## 🔧 API Endpoints

### Agentic AI Endpoints (Port 5003)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/agentic_predict` | POST | Enhanced prediction with agentic AI |
| `/agentic_status` | GET | System status and agent information |
| `/agentic_performance` | GET | Performance metrics for all agents |
| `/agentic_learn` | POST | Submit feedback for learning |

### Original Endpoints (Port 5002)

All original endpoints remain unchanged and functional.

## 🧠 Agentic AI Components

### 1. Memory Management (`agentic_memory.py`)

- **Persistent Storage**: SQLite database for agent memories
- **Experience Learning**: Stores actions, outcomes, and success scores
- **Context Retrieval**: Find similar past experiences
- **Performance Tracking**: Monitor agent performance over time

### 2. Tool Registry (`agentic_tools.py`)

- **Weather API**: Get weather conditions for treatment planning
- **Soil Data**: Access soil conditions and recommendations
- **Market Prices**: Current crop prices and trends
- **Agricultural Database**: Research and guidelines
- **Pesticide Information**: Product recommendations
- **Local Experts**: Find nearby agricultural experts
- **Government Schemes**: Relevant support programs

### 3. Base Agentic Agent (`agentic_base.py`)

- **Goal Setting**: Agents can set and pursue objectives
- **Action Planning**: Autonomous planning of actions
- **Tool Usage**: Access to external tools and APIs
- **Learning**: Adaptation based on experience
- **Performance Monitoring**: Track and improve behavior

### 4. Enhanced Advisor Agent (`agentic_advisor.py`)

- **Comprehensive Analysis**: Uses multiple data sources
- **Weather Integration**: Considers weather for treatment timing
- **Product Availability**: Checks local product availability
- **Soil Analysis**: Considers soil conditions
- **Guideline Research**: Accesses latest agricultural guidelines

### 5. Agentic Orchestrator (`agentic_orchestrator.py`)

- **Intelligent Coordination**: Manages multiple agents
- **Conflict Resolution**: Resolves contradictory recommendations
- **Performance-Based Selection**: Activates agents based on performance
- **Context-Aware Processing**: Adapts to user context

## 🎯 How It Works

### 1. Request Processing
```
User Upload → Model Prediction → Agentic Orchestrator → Multiple Agents → Coordinated Response
```

### 2. Agentic Cycle
```
Plan Actions → Execute Tools → Learn from Experience → Adapt Behavior
```

### 3. Memory System
```
Store Experience → Retrieve Similar Contexts → Update Performance → Improve Decisions
```

## 📊 Agentic Features in Action

### Autonomous Decision Making
- Agents analyze context and set goals
- Plan actions using available tools
- Execute actions with confidence filtering
- Learn from outcomes

### Memory & Learning
- Store every action and outcome
- Retrieve similar past experiences
- Update success scores based on user feedback
- Adapt confidence thresholds

### Tool Usage
- Weather data for treatment timing
- Soil analysis for recommendations
- Market prices for cost considerations
- Research database for latest guidelines

### Conflict Resolution
- Detect contradictory recommendations
- Use LLM to resolve conflicts
- Prioritize safety and effectiveness
- Provide unified recommendations

## 🔍 Monitoring & Analytics

### System Status
```bash
curl http://localhost:5003/agentic_status
```

### Performance Metrics
```bash
curl http://localhost:5003/agentic_performance
```

### Learning Feedback
```bash
curl -X POST http://localhost:5003/agentic_learn \
  -H "Content-Type: application/json" \
  -d '{"session_id": "session_123", "user_rating": 5}'
```

## 🚀 Usage Examples

### Basic Prediction
```bash
curl -X POST -F "file=@image.jpg" http://localhost:5003/agentic_predict
```

### Enhanced Prediction with Context
```bash
curl -X POST \
  -F "file=@image.jpg" \
  -F "user_id=farmer123" \
  -F "location=Telangana" \
  -F "user_type=farmer" \
  http://localhost:5003/agentic_predict
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Real API keys (currently using simulated data)
WEATHER_API_KEY=your_weather_api_key
SOIL_API_KEY=your_soil_api_key
MARKET_API_KEY=your_market_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### Agent Configuration
```python
# In agentic_base.py
self.confidence_threshold = 0.7  # Minimum confidence for action execution
self.learning_rate = 0.1         # Rate of behavioral adaptation
```

## 📈 Performance Optimization

### Memory Management
- Automatic cleanup of old memories
- Indexed database for fast retrieval
- Compressed storage for large datasets

### Tool Caching
- Session-based HTTP connections
- Result caching for repeated queries
- Graceful fallback for API failures

### Agent Coordination
- Asynchronous execution
- Performance-based agent selection
- Intelligent conflict resolution

## 🔒 Security & Privacy

### Data Protection
- User data anonymization
- Secure API key management
- Local memory storage

### Access Control
- Session-based authentication
- Rate limiting for API calls
- Input validation and sanitization

## 🐛 Troubleshooting

### Common Issues

1. **Agentic system not starting**
   - Check if port 5003 is available
   - Verify all dependencies are installed
   - Check console for error messages

2. **Memory database errors**
   - Ensure write permissions in the directory
   - Check SQLite installation
   - Verify database file path

3. **Tool API failures**
   - Check internet connectivity
   - Verify API keys (if using real APIs)
   - Check tool registry configuration

4. **Frontend connection issues**
   - Verify agentic backend is running on port 5003
   - Check CORS configuration
   - Ensure proper routing setup

### Debug Mode
```bash
# Enable debug logging
export AGENTIC_DEBUG=true
python agentic_health.py
```

## 🔮 Future Enhancements

### Planned Features
- **Multi-language Support**: Agentic responses in local languages
- **Real-time Collaboration**: Multiple agents working together
- **Advanced Analytics**: Detailed performance insights
- **Mobile Optimization**: Responsive agentic interface
- **API Integrations**: Real weather, soil, and market APIs

### Extensibility
- **Custom Agents**: Add specialized agents for specific crops
- **Tool Plugins**: Easy addition of new tools and APIs
- **Learning Models**: Advanced machine learning integration
- **Distributed Processing**: Multi-server agent coordination

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in console
3. Verify system status endpoints
4. Check performance metrics

## 🎉 Success!

Your crop health system now has true agentic AI capabilities:

✅ **Autonomous Decision Making**: Agents think and act independently
✅ **Memory & Learning**: System learns from every interaction
✅ **Tool Usage**: Access to external data and APIs
✅ **Goal-Oriented**: Agents pursue specific objectives
✅ **Conflict Resolution**: Intelligent handling of contradictions
✅ **Performance Adaptation**: Continuous improvement over time

The agentic AI system runs alongside your existing system, providing enhanced capabilities while maintaining full backward compatibility. 