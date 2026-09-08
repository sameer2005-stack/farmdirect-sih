from openai import OpenAI

from app.config import OPENAI_API_KEY, OPENAI_MODEL


client = OpenAI(api_key=OPENAI_API_KEY)


def detect_intent(message: str) -> dict:

    prompt = f"""
Analyze this farmer's message and extract the user's intent.

Possible intents:
Possible intents:

- GET_MARKET_PRICE
  User asks for the current or historical price/rate of a crop.

- SELLING_RECOMMENDATION
  User asks where, when, or to whom they should sell their crop,
  especially when they want the best selling option, best market,
  best expected price, or best शुद्ध प्रापण मूल्य.

- ADD_INVENTORY
  User is telling the system that they have crop stock and want to
  add/manage it as inventory.

- FIND_BUYER
  User specifically wants to find a buyer, wholesaler, retailer,
  processor, or other purchaser for their crop.

- GENERAL_QUERY
  General agricultural or conversational questions.

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