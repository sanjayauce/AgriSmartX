# agents/linker_agent.py

def find_local_experts(class_name: str) -> dict:
    """
    Finds and returns contact information for local experts or suppliers.
    """
    return {
        "title": "Local Support Contacts",
        "contacts": [
            {
                "name": "Local Agri-Expert Name",
                "phone": "+91-9876543210",
                "location": "District Agri-Office"
            },
            {
                "name": "Agri-Product Supplier Store",
                "phone": "+91-8765432109",
                "location": "Near Main Market"
            }
        ]
    } 