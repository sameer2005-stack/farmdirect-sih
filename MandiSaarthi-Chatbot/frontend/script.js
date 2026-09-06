const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const languageSelect = document.getElementById("language");
const suggestionsBox = document.getElementById("suggestions");


const sessionId = "farmer_001";


function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = `message ${sender}`;

    const content = document.createElement("div");

    content.className = "message-content";

    content.innerText = text;

    message.appendChild(content);

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}


function showSuggestions(suggestions) {

    suggestionsBox.innerHTML = "";

    suggestions.forEach((suggestion) => {

        const button = document.createElement("button");

        button.className = "suggestion";

        button.innerText = suggestion;

        button.onclick = () => {

            input.value = suggestion;

            sendMessage();
        };

        suggestionsBox.appendChild(button);
    });
}


async function sendMessage() {

    const message = input.value.trim();

    if (!message) {
        return;
    }


    addMessage(message, "user");

    input.value = "";

    suggestionsBox.innerHTML = "";


    try {

        const response = await fetch("http://127.0.0.1:8000/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: message,

                language: languageSelect.value,

                session_id: sessionId

            })

        });


        if (!response.ok) {
            throw new Error("API request failed");
        }


        const data = await response.json();


        addMessage(data.reply, "bot");


        if (data.suggestions) {
            showSuggestions(data.suggestions);
        }


    } catch (error) {

        console.error(error);

        addMessage(
            "Sorry, MandiSaarthi is temporarily unavailable.",
            "bot"
        );
    }
}


sendButton.addEventListener("click", sendMessage);


input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        sendMessage();

    }

});