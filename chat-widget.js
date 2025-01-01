const initializeChatLogic = (apiKey, versionID) => {
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    let activeChoices = []; // Store active choice buttons

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

        activeChoices = []; // Reset active choices on new traces

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

                    // Track active choices for matching typed input
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
        userMessage.style.margin = "5px 20px 5px 10px";
        userMessage.style.borderRadius = "20px";
        userMessage.style.maxWidth = "70%";
        userMessage.style.alignSelf = "flex-end";
        userMessage.innerText = message;
        chatWindow.appendChild(userMessage);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const handleTextInput = async () => {
        const userInput = document.getElementById("user-input").value.trim();
        if (!userInput) return;

        // Check if the input matches an active choice
        const matchedChoice = activeChoices.find(choice => choice.label === userInput.toLowerCase());
        if (matchedChoice) {
            // Add user bubble and send the matched choice
            addUserBubble(matchedChoice.label);
            await interact(matchedChoice.request);
        } else {
            // Otherwise, treat input as free-form text
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

    // Launch the initial conversation
    interact({ type: "launch" });
};
