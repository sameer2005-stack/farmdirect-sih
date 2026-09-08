from typing import List, Dict


def calculate_net_realization(
    predicted_price_per_quintal: float,
    distance_km: float,
    quantity_kg: float,
    transport_rate_per_km: float,
    other_cost_per_kg: float = 0.0,
) -> Dict[str, float]:
    """
    Calculate the expected net realization for a market.

    Returns values in Rs./kg and total Rs.
    """

    if quantity_kg <= 0:
        raise ValueError("Quantity must be greater than zero.")

    if distance_km < 0:
        raise ValueError("Distance cannot be negative.")

    predicted_price_per_kg = predicted_price_per_quintal / 100

    total_transport_cost = distance_km * transport_rate_per_km
    transport_cost_per_kg = total_transport_cost / quantity_kg

    net_price_per_kg = (
        predicted_price_per_kg
        - transport_cost_per_kg
        - other_cost_per_kg
    )

    total_net_realization = net_price_per_kg * quantity_kg

    return {
        "predicted_price_per_kg": predicted_price_per_kg,
        "transport_cost_per_kg": transport_cost_per_kg,
        "net_price_per_kg": net_price_per_kg,
        "total_net_realization": total_net_realization,
    }


def rank_markets(
    market_predictions: List[Dict],
    quantity_kg: float,
    transport_rate_per_km: float,
    other_cost_per_kg: float = 0.0,
) -> List[Dict]:
    """
    Rank markets by expected net realization.

    market_predictions should contain:
    - market_name
    - state
    - district
    - predicted_price_per_quintal
    - distance_km
    """

    results = []

    for market in market_predictions:
        calculation = calculate_net_realization(
            predicted_price_per_quintal=market["predicted_price_per_quintal"],
            distance_km=market["distance_km"],
            quantity_kg=quantity_kg,
            transport_rate_per_km=transport_rate_per_km,
            other_cost_per_kg=other_cost_per_kg,
        )

        results.append({
            **market,
            **calculation,
        })

    results.sort(
        key=lambda x: x["net_price_per_kg"],
        reverse=True,
    )

    return results