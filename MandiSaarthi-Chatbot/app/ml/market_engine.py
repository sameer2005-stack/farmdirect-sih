from app.ml.price_prediction import predict_next_price
from app.ml.recommendation import rank_markets


def recommend_markets(
    market_candidates: list[dict],
    quantity_kg: float,
    transport_rate_per_km: float,
    other_cost_per_kg: float = 0.0,
) -> list[dict]:
    """
    Predict prices and rank markets by expected net realization.
    """

    market_predictions = []

    for market in market_candidates:
        prediction_features = market["features"]

        predicted_price = predict_next_price(
            prediction_features
        )

        market_predictions.append({
            "market_name": market["market_name"],
            "state": market["state"],
            "district": market["district"],
            "predicted_price_per_quintal": predicted_price,
            "distance_km": market["distance_km"],
        })

    return rank_markets(
        market_predictions=market_predictions,
        quantity_kg=quantity_kg,
        transport_rate_per_km=transport_rate_per_km,
        other_cost_per_kg=other_cost_per_kg,
    )