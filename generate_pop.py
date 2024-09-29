import json

b = []
a = json.load(open("cities.json"))

for d in a:
    if d["population"] > 1_000_000:
        b.append({"name": d["name"], "location": d["coordinates"]})
print(f"Found {len(b)} big cities.")
json.dump(b, open("big_cities.json", "w"))