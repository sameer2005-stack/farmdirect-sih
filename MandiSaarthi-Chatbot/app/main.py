from app.suggestions import generate_suggestions
from app.intent import detect_intent
from app.conversation import get_history, add_message
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

from app.llm import generate_response


app = FastAPI(
    title="MandiSaarthi API",
    description="AI-powered multilingual market assistant for KisanSetu",
    version="0.2.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    language: str = "auto"
    session_id: str = "default"


class ChatResponse(BaseModel):
    reply: str
    suggestions: list[str]


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "MandiSaarthi",
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        history = get_history(request.session_id)
        intent = detect_intent(request.message)
        print("DETECTED INTENT:", intent)

        reply = generate_response(
            user_message=request.message,
            language=request.language,
            history=history,
        )
        suggestions = generate_suggestions(
            request.message,
            language=request.language,
        )

        add_message(
            request.session_id,
            "user",
            request.message,
        )

        add_message(
            request.session_id,
            "assistant",
            reply,
        )

        return ChatResponse(reply=reply, suggestions=suggestions)

    except Exception as exc:
        print(f"CHAT ERROR: {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=500,
            detail="MandiSaarthi is temporarily unavailable.",
        ) from exc
    