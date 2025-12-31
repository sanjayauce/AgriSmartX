import re
from collections import defaultdict

def analyze_mandals():
    # Read the JavaScript file
    with open('src/data/telanganaMandalsData.js', 'r') as file:
        content = file.read()
    
    # Extract all mandal entries using regex
    mandal_pattern = r'{\s*mandal:\s*"([^"]+)",\s*district:\s*"([^"]+)",\s*revenue_division:\s*"([^"]+)"\s*}'
    mandals = re.findall(mandal_pattern, content)
    
    # Count total mandals
    total_mandals = len(mandals)
    
    # Count districts
    districts = set()
    for mandal in mandals:
        districts.add(mandal[1])  # district is the second element
    total_districts = len(districts)
    
    # Count revenue divisions
    revenue_divisions = set()
    for mandal in mandals:
        revenue_divisions.add(mandal[2])  # revenue_division is the third element
    total_revenue_divisions = len(revenue_divisions)
    
    # Check for duplicates
    mandal_occurrences = defaultdict(list)
    for mandal, district, revenue_division in mandals:
        mandal_occurrences[mandal].append((district, revenue_division))
    
    # Find duplicates
    duplicates = {mandal: occurrences for mandal, occurrences in mandal_occurrences.items() if len(occurrences) > 1}
    
    # Print summary
    print("\nSUMMARY:")
    print("=" * 40)
    print(f"Total number of districts: {total_districts}")
    print(f"Total number of revenue divisions: {total_revenue_divisions}")
    print(f"Total number of mandals: {total_mandals}")
    print("=" * 40)
    
    if duplicates:
        print("\nDUPLICATE MANDALS FOUND:")
        print("=" * 40)
        for mandal, occurrences in duplicates.items():
            print(f"\nMandal: {mandal}")
            for district, revenue_division in occurrences:
                print(f"  - District: {district}")
                print(f"    Revenue Division: {revenue_division}")
    else:
        print("\nNo duplicate mandals found.")

if __name__ == "__main__":
    analyze_mandals() 