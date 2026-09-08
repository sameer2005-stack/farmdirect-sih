from app.ml.service import get_market_recommendation


market_candidates = [
    {
        "market_name": "Market A",
        "state": "West Bengal",
        "district": "Burdwan",
        "distance_km": 100,
        "features": {
            "State Name": "West Bengal",
            "District Name": "Burdwan",
            "Market Name": "Katwa",
            "Variety": "Tomato",
            "Group": "Vegetables",
            "Arrivals (Tonnes)": 10.0,
            "Price_Lag_1": 2300.0,
            "Price_Lag_7": 2200.0,
            "Price_Rolling_7": 2250.0,
            "Price_Rolling_30": 2100.0,
            "Year": 2024,
            "Month": 2,
            "Day": 2,
            "DayOfWeek": 4,
            "Price_Spread": 500.0,
        },
    },
    {
        "market_name": "Market B",
        "state": "Gujarat",
        "district": "Dahod",
        "distance_km": 50,
        "features": {
            "State Name": "Gujarat",
            "District Name": "Dahod",
            "Market Name": "Dahod",
            "Variety": "Tomato",
            "Group": "Vegetables",
            "Arrivals (Tonnes)": 12.0,
            "Price_Lag_1": 2100.0,
            "Price_Lag_7": 2050.0,
            "Price_Rolling_7": 2080.0,
            "Price_Rolling_30": 2000.0,
            "Year": 2024,
            "Month": 2,
            "Day": 2,
            "DayOfWeek": 4,
            "Price_Spread": 450.0,
        },
    },
]


results = get_market_recommendation(
    market_candidates=market_candidates,
    quantity_kg=500,
    transport_rate_per_km=25,
    other_cost_per_kg=0.50,
)


print("========== ML SERVICE TEST ==========")

for i, market in enumerate(results, start=1):
    print(
        f"{i}. {market['market_name']} | "
        f"Net: ₹{market['net_price_per_kg']:,.2f}/kg | "
        f"Total: ₹{market['total_net_realization']:,.2f}"
    )

print("\nML service working successfully.")