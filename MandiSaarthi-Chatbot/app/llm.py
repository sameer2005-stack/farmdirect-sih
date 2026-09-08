from openai import OpenAI

from app.config import OPENAI_API_KEY, OPENAI_MODEL
from app.prompts import SYSTEM_PROMPT


client = OpenAI(api_key=OPENAI_API_KEY)


def generate_response(
    user_message: str,
    language: str = "auto",
    history: list[dict] | None = None,
    recommendation_context: str = "",
) -> str:

    language_instruction = (
        f"Respond in {language}."
        if language.lower() != "auto"
        else "Respond in the user's language."
    )

    history = history or []

    input_messages = history + [
        {
            "role": "user",
            "content": user_message,
        }
    ]

    if recommendation_context:
        input_messages.append(
        {
            "role": "user",
            "content": (
                "Use the following KisanSetu ML recommendation to answer "
                "the farmer's request. These are model-generated results. "
                "Do not change or invent the numbers.\n\n"
                f"{recommendation_context}"
            ),
        }
    )

    response = client.responses.create(
        model=OPENAI_MODEL,
        instructions=f"{SYSTEM_PROMPT}\n\n{language_instruction}",
        input=input_messages,
    )

    return response.output_text 
