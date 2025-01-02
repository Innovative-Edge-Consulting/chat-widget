// Chat Widget Initialization
const createChatWidget = (config) => {
    const { apiKey, versionID, containerID } = config;

    if (!apiKey || !versionID) {
        console.error("Missing API Key or Version ID. Please provide both.");
        return;
    }

    // Get the parent container
    const container = document.getElementById(containerID);
    if (!container) {
        console.error(`Container with ID "${containerID}" not found!`);
        return;
    }

    // Create the main widget container
    const widget = document.createElement("div");
    widget.id = "chat-widget";
    widget.className = "chat-container"; // Apply CSS class for container styling
    container.appendChild(widget);

    // Create chat window
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.className = "chat-window"; // Apply CSS class for chat window
    widget.appendChild(chatWindow);

    // Create input area
    const inputArea = document.createElement("div");
    inputArea.id = "input-area";
    inputArea.className = "typing-container"; // Apply CSS class for input area
    widget.appendChild(inputArea);

    const userInput = document.createElement("input");
    userInput.id = "user-input";
    userInput.type = "text";
    userInput.placeholder = "Type your message...";
    userInput.className = "typing-textarea"; // Apply CSS class for text input
    inputArea.appendChild(userInput);

    // Create send button
    const sendButton = document.createElement("button");
    sendButton.id = "send-button";
    sendButton.innerHTML = "&#9654;"; // Unicode for right-pointing arrow
    sendButton.className = "typing-controls"; // Apply CSS class for send button
    inputArea.appendChild(sendButton);

    // Initialize Chat Logic
    initializeChatLogic(apiKey, versionID);
};

// Chat Logic Initialization
const initializeChatLogic = (apiKey, versionID) => {
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    let activeChoices = [];

    const interact = async (request) => {
        try {
            const response = await fetch(`https://general-runtime.voiceflow.com/state/user/${userId}/interact`, {
                method: "POST",
                headers: {
                    Authorization: apiKey,
                    versionID,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ request }),
            });

            const traces = await response.json();
            handleTraces(traces);
        } catch (error) {
            console.error("Error interacting with Voiceflow:", error);
        }
    };

    const handleTraces = (traces) => {
        const chatWindow = document.getElementById("chat-window");
        if (!chatWindow) return console.error("Chat window not found!");

        activeChoices = [];

        traces.forEach((trace) => {
            if (trace.type === "text") {
                const message = document.createElement("div");
                message.className = "assistant-bubble";
                message.innerText = trace.payload.message;
                chatWindow.appendChild(message);
            } else if (trace.type === "choice") {
                const buttonContainer = document.createElement("div");
                buttonContainer.className = "button-container";

                trace.payload.buttons.forEach((button) => {
                    const buttonElement = document.createElement("button");
                    buttonElement.className = "choice-button";
                    buttonElement.innerText = button.name;
                    buttonElement.onclick = () => {
                        addUserBubble(button.name);
                        interact(button.request);
                    };

                    buttonContainer.appendChild(buttonElement);
                    activeChoices.push({ label: button.name.toLowerCase(), request: button.request });
                });

                chatWindow.appendChild(buttonContainer);
            }
        });

        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const addUserBubble = (message) => {
        const chatWindow = document.getElementById("chat-window");
        if (!chatWindow) return console.error("Chat window not found!");

        const userMessage = document.createElement("div");
        userMessage.className = "user-bubble";
        userMessage.innerText = message;
        chatWindow.appendChild(userMessage);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const handleTextInput = async () => {
        const userInput = document.getElementById("user-input");
        const text = userInput.value.trim();
        if (!text) return;

        // Display the user message
        addUserBubble(text);

        // Send the user's input to Voiceflow
        await interact({ type: "text", payload: text });

        userInput.value = ""; // Clear input field
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    document.getElementById("send-button").onclick = handleTextInput;
    document.getElementById("user-input").onkeydown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleTextInput();
        }
    };

    interact({ type: "launch" });
};
