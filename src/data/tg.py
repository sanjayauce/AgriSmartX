import json
import os
import re

def read_js_file():
    js_file_path = os.path.join(os.path.dirname(__file__), 'telanganaMandalsData.js')
    with open(js_file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        # Extract the array part
        match = re.search(r'\[(.*)\]', content, re.DOTALL)
        if match:
            array_str = match.group(0)
            # Remove comments
            array_str = re.sub(r'//.*?\n', '\n', array_str)
            # Add quotes to property names
            array_str = re.sub(r'(\s*)(\w+):', r'\1"\2":', array_str)
            # Parse the JSON array
            return json.loads(array_str)
    return []

mandalsList = read_js_file()

def get_districts():
    districts = set()
    for mandal in mandalsList:
        districts.add(mandal['district'])
    return sorted(list(districts))

def get_revenue_divisions():
    revenue_divisions = set()
    for mandal in mandalsList:
        if 'revenue_division' in mandal:
            revenue_divisions.add(mandal['revenue_division'])
    return sorted(list(revenue_divisions))

def get_mandals_by_district(district):
    return [mandal['mandal'] for mandal in mandalsList if mandal['district'] == district]

def get_mandals_by_revenue_division(revenue_division):
    return [mandal['mandal'] for mandal in mandalsList if mandal.get('revenue_division') == revenue_division]

def get_revenue_divisions_by_district(district):
    revenue_divisions = set()
    for mandal in mandalsList:
        if mandal['district'] == district and 'revenue_division' in mandal:
            revenue_divisions.add(mandal['revenue_division'])
    return sorted(list(revenue_divisions))

def print_districts():
    districts = get_districts()
    print("\nList of Districts in Telangana:")
    for i, district in enumerate(districts, 1):
        # Remove the word "district" from the end and print
        clean_name = district.replace(" district", "")
        print(f"{i}. {clean_name}")

def print_statistics():
    districts = get_districts()
    revenue_divisions = get_revenue_divisions()
    
    print(f"\nTotal number of districts: {len(districts)}")
    print(f"Total number of revenue divisions: {len(revenue_divisions)}")
    print(f"Total number of mandals: {len(mandalsList)}")
    
    print("\nDistricts and their mandals count:")
    for district in districts:
        mandals = get_mandals_by_district(district)
        print(f"{district}: {len(mandals)} mandals")
    
    print("\nRevenue divisions and their mandals count:")
    for revenue_division in revenue_divisions:
        mandals = get_mandals_by_revenue_division(revenue_division)
        print(f"{revenue_division}: {len(mandals)} mandals")

if __name__ == "__main__":
    print_districts() 