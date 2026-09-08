from pathlib import Path

import joblib
import pandas as pd


# Model files
ML_DIR = Path(__file__).resolve().parent

MODEL_PATH = ML_DIR / "ridge_price_model.pkl"
PREPROCESSOR_PATH = ML_DIR / "price_preprocessor.pkl"


# Load once when the service starts
price_model = joblib.load(MODEL_PATH)
price_preprocessor = joblib.load(PREPROCESSOR_PATH)


FEATURES = [
    "State Name",
    "District Name",
    "Market Name",
    "Variety",
    "Group",
    "Arrivals (Tonnes)",
    "Price_Lag_1",
    "Price_Lag_7",
    "Price_Rolling_7",
    "Price_Rolling_30",
    "Year",
    "Month",
    "Day",
    "DayOfWeek",
    "Price_Spread",
]


def predict_next_price(features: dict) -> float:
    """
    Predict the next available reported modal market price.

    Returns:
        Predicted price in Rs./quintal.
    """

    input_df = pd.DataFrame([features])

    missing_features = [
        feature
        for feature in FEATURES
        if feature not in input_df.columns
    ]

    if missing_features:
        raise ValueError(
            f"Missing prediction features: {missing_features}"
        )

    input_df = input_df[FEATURES]

    encoded_input = price_preprocessor.transform(input_df)

    prediction = price_model.predict(encoded_input)[0]

    return float(prediction)