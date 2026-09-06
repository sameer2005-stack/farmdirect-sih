from app.intent import detect_intent


message = "मेरे पास 500 किलो टमाटर हैं।"

result = detect_intent(message)

print(result)