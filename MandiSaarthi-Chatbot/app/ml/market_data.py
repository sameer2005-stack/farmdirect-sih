from typing import List, Dict


def get_market_candidates(
    crop: str,
    quantity_kg: float,
) -> List[Dict]:
    """
    Return market candidates for a farmer's crop.

    Temporary prototype data.
    This will later be replaced by backend/live market data.
    """

    if crop.strip().lower() != "tomato":
        return []

    return [
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