from openai import OpenAI

from app.config import OPENAI_API_KEY, OPENAI_MODEL


client = OpenAI(api_key=OPENAI_API_KEY)


def generate_suggestions(message: str, language: str = "auto") -> list[str]:

    language_instruction = (
        f"Generate suggestions in {language}."
        if language.lower() != "auto"
        else "Generate suggestions in the same language as the farmer."
    )

    prompt = f"""
You are generating autocomplete suggestions for MandiSaarthi,
an agricultural market assistant.

Based on the farmer's message, generate 4 useful follow-up questions
the farmer might want to ask.

Rules:
- Suggestions must be short and natural.
- They should be useful to a farmer.
- Do not invent market prices, buyers, or other factual information.
- Return ONLY a JSON array of strings.
- {language_instruction}

Farmer message:
{message}
"""

    response = client.responses.create(
        model=OPENAI_MODEL,
        instructions="Return only valid JSON.",
        input=prompt,
    )

    import json

    return json.loads(response.output_text)