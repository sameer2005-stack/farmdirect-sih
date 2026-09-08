from app.ml.service import get_market_recommendation
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
    version="0.3.0",
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

class RecommendationRequest(BaseModel):
    crop: str = Field(..., min_length=1)
    quantity_kg: float = Field(..., gt=0)
    transport_rate_per_km: float = Field(..., ge=0)
    other_cost_per_kg: float = Field(default=0.0, ge=0)


class RecommendationResponse(BaseModel):
    recommendations: list[dict]


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


@app.post(
    "/recommend",
    response_model=RecommendationResponse,
)
def recommend(request: RecommendationRequest):

    try:
        recommendations = get_market_recommendation(
            crop=request.crop,
            quantity_kg=request.quantity_kg,
            transport_rate_per_km=request.transport_rate_per_km,
            other_cost_per_kg=request.other_cost_per_kg,
        )

        return RecommendationResponse(
            recommendations=recommendations
        )

    except Exception as exc:
        print(
            f"RECOMMENDATION ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Market recommendation is temporarily unavailable.",
        ) from exc