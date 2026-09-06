from openai import OpenAI

from app.config import OPENAI_API_KEY, OPENAI_MODEL


client = OpenAI(api_key=OPENAI_API_KEY)


def detect_intent(message: str) -> dict:

    prompt = f"""
Analyze this farmer's message and extract the user's intent.

Possible intents:
- GET_MARKET_PRICE
- SELLING_RECOMMENDATION
- ADD_INVENTORY
- FIND_BUYER
- GENERAL_QUERY

Extract these fields when available:
- intent
- crop
- quantity
- unit
- location

Return ONLY valid JSON.

Farmer message:
{message}
"""

    response = client.responses.create(
        model=OPENAI_MODEL,
        instructions="You are an intent extraction system. Return only valid JSON.",
        input=prompt,
    )

    import json

    return json.loads(response.output_text)