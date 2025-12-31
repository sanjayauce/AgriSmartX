import pandas as pd

# Official mandal counts per district
official_counts = {
    "Alluri Sitharama Raju district": 22,
    "Anakapalli district": 33,
    "Anantapur district": 63,
    "Annamayya district": 57,
    "Bapatla district": 23,
    "Chittoor district": 34,
    "Dr. B.R. Ambedkar Konaseema district": 22,
    "East Godavari district": 32,
    "Eluru district": 28,
    "Guntur district": 57,
    "Kakinada district": 21,
    "Krishna district": 25,
    "Kurnool district": 54,
    "NTR district": 20,
    "Nandyal district": 31,
    "Palnadu district": 28,
    "Parvathipuram Manyam district": 34,
    "Prakasam district": 56,
    "Sri Potti Sriramulu Nellore district": 46,
    "Sri Sathya Sai district": 25,
    "Srikakulam district": 38,
    "Tirupati district": 34,
    "Visakhapatnam district": 43,
    "Vizianagaram district": 34,
    "West Godavari district": 28,
    "YSR district": 51
}

# Read the full CSV file
df = pd.read_csv("src/data/apcsv_with_revenue.csv")

# Clean up column names
df.columns = [col.strip().replace(' ', '_') for col in df.columns]

# Count unique districts and mandals
district_count = df["district"].nunique()
mandal_count = df["mandal"].nunique()

print(f"\nTotal Analysis:")
print("-" * 50)
print(f"Number of unique districts: {district_count} (Official: 26)")
print(f"Number of unique mandals: {mandal_count} (Official: 679)")
print(f"Missing mandals: {679 - mandal_count}")

print("\nDetailed District Analysis:")
print("-" * 50)
print("District | Current Mandals | Official Mandals | Missing")
print("-" * 70)

district_mandal_counts = df.groupby("district")[["mandal"]].count()
for district, row in district_mandal_counts.iterrows():
    current = row["mandal"]
    official = official_counts.get(district, 0)
    missing = official - current
    print(f"{district:<40} | {current:>14} | {official:>15} | {missing:>7}")

print("\nDetailed District Analysis:")
print("-" * 50)
district_mandal_counts = df.groupby("district")[["mandal", "revenue_division"]].agg({
    "mandal": "count",
    "revenue_division": "nunique"
}).sort_values("mandal", ascending=False)

district_mandal_counts.columns = ["Mandal Count", "Revenue Division Count"]
print(district_mandal_counts)

print("\nRevenue Division Analysis:")
print("-" * 50)
revenue_division_counts = df.groupby("district")["revenue_division"].unique()
for district in revenue_division_counts.index:
    print(f"\n{district}:")
    print(f"Revenue Divisions: {', '.join(revenue_division_counts[district])}")
