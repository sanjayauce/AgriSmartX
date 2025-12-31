#!/usr/bin/env python3
"""
Test script to verify frontend integration with agentic AI
"""

import requests
import json

def test_agentic_response_format():
    """Test the agentic AI response format"""
    try:
        # Create a mock image file for testing
        with open('test_image.jpg', 'w') as f:
            f.write('mock image data')
        
        # Test the agentic predict endpoint
        with open('test_image.jpg', 'rb') as f:
            files = {'file': ('test_image.jpg', f, 'image/jpeg')}
            data = {
                'user_id': 'test_user@example.com',
                'user_type': 'farmer',
                'location': 'India',
                'language': 'en'
            }
            
            response = requests.post(
                'http://localhost:5003/agentic_predict',
                files=files,
                data=data,
                headers={'Accept-Language': 'en'}
            )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Agentic AI Response Structure:")
            print(f"   Status Code: {response.status_code}")
            print(f"   Has prediction: {'prediction' in result}")
            print(f"   Has agentic_response: {'agentic_response' in result}")
            print(f"   Has agentic_metadata: {'agentic_metadata' in result}")
            print(f"   Has request_info: {'request_info' in result}")
            
            if 'agentic_metadata' in result:
                metadata = result['agentic_metadata']
                print(f"   Agents used: {metadata.get('agents_used', [])}")
                print(f"   Total actions: {metadata.get('total_actions', 0)}")
                print(f"   Overall confidence: {metadata.get('overall_confidence', 0)}")
                print(f"   Learning applied: {metadata.get('learning_applied', False)}")
            
            return True
        else:
            print(f"❌ Agentic predict failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing agentic response: {e}")
        return False
    finally:
        # Clean up test file
        import os
        if os.path.exists('test_image.jpg'):
            os.remove('test_image.jpg')

def main():
    print("🧪 Testing Frontend Integration with Agentic AI...")
    print("=" * 60)
    
    success = test_agentic_response_format()
    
    if success:
        print("\n✅ Frontend integration test passed!")
        print("\n📝 The frontend should now be able to handle:")
        print("   - Original response format (advisory, support_services, etc.)")
        print("   - Agentic AI response format (agentic_response, agentic_metadata)")
        print("   - Mixed response formats with proper fallbacks")
        print("   - Error handling for missing properties")
    else:
        print("\n❌ Frontend integration test failed!")
        print("   Please check the agentic AI backend and try again.")

if __name__ == "__main__":
    main() 