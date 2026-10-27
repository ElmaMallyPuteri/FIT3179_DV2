"""Builds data/state_metrics.csv, the table used by charts 01, 04, 07 and 11.

Inputs (all in data/):
  state_totals.csv      Tourism Research Australia: trips, nights, spend, average nights, year to June 2026
  state_population.csv  ABS, National, state and territory population, 31 March 2026 (thousands)
  states.csv            Label positions (lon/lat) and tile-grid positions for each state

Run from the project root:  python3 tools/make_state_metrics.py
"""
import csv

def read(name):
    with open(f"data/{name}", newline="") as f:
        return list(csv.DictReader(f))

pop = {r["state"]: float(r["pop_k"]) for r in read("state_population.csv")}
geo = {r["state"]: r for r in read("states.csv")}

rows = []
for r in read("state_totals.csv"):
    s = r["state"]
    trips, nights, spend = float(r["trips_k"]), float(r["nights_k"]), float(r["spend_m"])
    g = geo[s]
    rows.append({
        "state": s, "abbr": g["abbr"], "lon": g["lon"], "lat": g["lat"],
        "tile_x": g["tile_x"], "tile_y": g["tile_y"],
        "trips_k": int(trips), "nights_k": int(nights), "spend_m": int(spend),
        "avg_nights": r["avg_nights"], "pop_k": pop[s],
        "trips_per_1000": round(trips / pop[s] * 1000),   # trips divided by residents, per 1,000 people
        "spend_per_trip": round(spend / trips * 1000),    # dollars per trip
        "spend_per_night": round(spend / nights * 1000),  # dollars per night
    })

with open("data/state_metrics.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0]), lineterminator="\n")
    w.writeheader()
    w.writerows(rows)
print("wrote data/state_metrics.csv with", len(rows), "rows")
