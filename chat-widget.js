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
    widget.style.display = "flex";
    widget.style.flexDirection = "column";
    widget.style.width = "100%";
    widget.style.height = "100%";
    widget.style.position = "relative";
    widget.style.backgroundColor = "#FFFFFF";
    container.appendChild(widget);

    // Create chat window
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style.flex = "1";
    chatWindow.style.overflowY = "auto"; // Scrollable area
    chatWindow.style.padding = "10px";
    chatWindow.style.backgroundColor = "#FFFFFF";
    widget.appendChild(chatWindow);

    // Create input area
    const inputArea = document.createElement("div");
    inputArea.id = "input-area";
    inputArea.style.position = "fixed"; // Fixed at the bottom
    inputArea.style.bottom = "0";
    inputArea.style.width = "100%";
    inputArea.style.display = "flex";
    inputArea.style.alignItems = "center";
    inputArea.style.padding = "10px";
    inputArea.style.backgroundColor = "#F9F9F9";
    inputArea.style.boxShadow = "0px -2px 5px rgba(0,0,0,0.1)"; // Shadow for separation
    container.appendChild(inputArea);

    const userInput = document.createElement("input");
    userInput.id = "user-input";
    userInput.type = "text";
    userInput.placeholder = "Type your message...";
    userInput.style.flex = "1";
    userInput.style.border = "1px solid #CCC";
    userInput.style.borderRadius = "5px";
    userInput.style.padding = "10px";
    inputArea.appendChild(userInput);

    // Create send button
    const sendButton = document.createElement("button");
    sendButton.id = "send-button";
    sendButton.innerHTML = "&#9654;"; // Unicode for right-pointing arrow
    sendButton.style.marginLeft = "10px";
    sendButton.style.padding = "10px";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "50%";
    sendButton.style.backgroundColor = "#007AFF";
    sendButton.style.color = "#FFF";
    sendButton.style.cursor = "pointer";
    sendButton.style.width = "40px";
    sendButton.style.height = "40px";
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
                message.style.backgroundColor = "#E5E5EA";
                message.style.color = "#000";
                message.style.padding = "10px 15px";
                message.style.margin = "5px 10px 5px 20px";
                message.style.borderRadius = "20px";
                message.style.maxWidth = "70%";
                message.style.alignSelf = "flex-start";
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

                    buttonElement.style.padding = "10px 15px";
                    buttonElement.style.margin = "2px 5px 2px 20px";
                    buttonElement.style.borderRadius = "25px";
                    buttonElement.style.border = "1px solid #007AFF";
                    buttonElement.style.backgroundColor = "#FFFFFF";
                    buttonElement.style.color = "#007AFF";
                    buttonElement.style.cursor = "pointer";
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

        userMessage.style.backgroundColor = "#007AFF";
        userMessage.style.color = "#FFF";
        userMessage.style.padding = "10px 15px";
        userMessage.style.margin = "5px 0 5px auto";
        userMessage.style.borderRadius = "15px";
        userMessage.style.maxWidth = "50%";
        userMessage.style.width = "fit-content";
        userMessage.style.wordBreak = "break-word";
        userMessage.style.textAlign = "left";

        userMessage.innerText = message;
        chatWindow.appendChild(userMessage);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const handleTextInput = async () => {
        const userInput = document.getElementById("user-input").value.trim();
        if (!userInput) return;

        const matchedChoice = activeChoices.find(choice => choice.label === userInput.toLowerCase());
        if (matchedChoice) {
            addUserBubble(matchedChoice.label);
            await interact(matchedChoice.request);
        } else {
            addUserBubble(userInput);
            await interact({ type: "text", payload: userInput });
        }

        document.getElementById("user-input").value = "";
    };

    document.getElementById("send-button").onclick = (event) => {
        event.preventDefault();
        handleTextInput();
    };

    document.getElementById("user-input").onkeydown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleTextInput();
        }
    };

    interact({ type: "launch" });
};
