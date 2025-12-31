import re

def analyze_mandals_data():
    # Read the JavaScript file
    with open('src/data/andhraPradeshMandalsData.js', 'r') as file:
        content = file.read()
    
    # Extract the array content
    start = content.find('[')
    end = content.rfind(']') + 1
    array_content = content[start:end]
    
    # Parse the JavaScript array using regex
    pattern = r'{\s*mandal:\s*"([^"]+)",\s*district:\s*"([^"]+)"(?:,\s*revenue_division:\s*"([^"]+)")?\s*}'
    matches = re.finditer(pattern, array_content)
    
    # Initialize counters
    districts = set()
    mandals = set()
    revenue_divisions = set()
    district_mandals = {}
    district_revenue_divisions = {}
    
    # Process each match
    for match in matches:
        mandal = match.group(1)
        district = match.group(2)
        revenue_division = match.group(3)
        
        districts.add(district)
        mandals.add(mandal)
        if revenue_division:
            revenue_divisions.add(revenue_division)
        
        if district not in district_mandals:
            district_mandals[district] = set()
            district_revenue_divisions[district] = set()
        
        district_mandals[district].add(mandal)
        if revenue_division:
            district_revenue_divisions[district].add(revenue_division)
    
    # Print results
    print("\nAndhra Pradesh Administrative Analysis:")
    print("=====================================")
    print(f"Total number of districts: {len(districts)}")
    print(f"Total number of mandals: {len(mandals)}")
    print(f"Total number of revenue divisions: {len(revenue_divisions)}")
    
    # Print district-wise breakdown
    print("\nDistrict-wise breakdown:")
    print("======================")
    for district in sorted(districts):
        print(f"\n{district}:")
        print(f"  Mandals: {len(district_mandals[district])}")
        print(f"  Revenue Divisions: {len(district_revenue_divisions[district])}")

if __name__ == "__main__":
    analyze_mandals_data() 