from typing import Dict, List


conversation_store: Dict[str, List[dict]] = {}


def get_history(session_id: str) -> List[dict]:
    return conversation_store.get(session_id, [])


def add_message(session_id: str, role: str, content: str):
    if session_id not in conversation_store:
        conversation_store[session_id] = []

    conversation_store[session_id].append(
        {
            "role": role,
            "content": content,
        }
    )


def clear_history(session_id: str):
    conversation_store.pop(session_id, None)