#!/usr/bin/env python3
"""
Test script to verify agentic AI integration
"""

import requests
import json

def test_agentic_status():
    """Test the agentic status endpoint"""
    try:
        response = requests.get('http://localhost:5003/agentic_status')
        if response.status_code == 200:
            data = response.json()
            print("✅ Agentic AI Status:")
            print(f"   System: {data.get('system')}")
            print(f"   Status: {data.get('status')}")
            print(f"   Agents: {len(data.get('agents', {}))}")
            print(f"   Capabilities: {len(data.get('capabilities', []))}")
            return True
        else:
            print(f"❌ Status check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error checking status: {e}")
        return False

def test_agentic_performance():
    """Test the agentic performance endpoint"""
    try:
        response = requests.get('http://localhost:5003/agentic_performance')
        if response.status_code == 200:
            data = response.json()
            print("✅ Agentic AI Performance:")
            print(f"   Coordination sessions: {data.get('coordination_sessions', 0)}")
            return True
        else:
            print(f"❌ Performance check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error checking performance: {e}")
        return False

def main():
    print("🤖 Testing Agentic AI Integration...")
    print("=" * 50)
    
    # Test status
    status_ok = test_agentic_status()
    print()
    
    # Test performance
    performance_ok = test_agentic_performance()
    print()
    
    if status_ok and performance_ok:
        print("✅ All tests passed! Agentic AI system is ready.")
        print("\n📝 Next steps:")
        print("   1. Open your React app in the browser")
        print("   2. Navigate to Crop Health page")
        print("   3. Upload an image to test the agentic AI")
        print("   4. You should see enhanced responses with agentic capabilities")
    else:
        print("❌ Some tests failed. Please check the agentic AI backend.")

if __name__ == "__main__":
    main() 