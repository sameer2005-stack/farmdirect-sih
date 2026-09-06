from app.suggestions import generate_suggestions


message = "मेरे पास 500 किलो टमाटर हैं।"

suggestions = generate_suggestions(
    message,
    language="hi",
)

print(suggestions)