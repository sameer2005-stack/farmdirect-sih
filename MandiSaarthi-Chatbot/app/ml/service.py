from app.ml.market_engine import recommend_markets


def get_market_recommendation(
    market_candidates: list[dict],
    quantity_kg: float,
    transport_rate_per_km: float,
    other_cost_per_kg: float = 0.0,
) -> list[dict]:

    return recommend_markets(
        market_candidates=market_candidates,
        quantity_kg=quantity_kg,
        transport_rate_per_km=transport_rate_per_km,
        other_cost_per_kg=other_cost_per_kg,
    )