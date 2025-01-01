// Chat Widget Function
const createChatWidget = (config) => {
    const { apiKey, versionID, containerID } = config;

    // Ensure container exists
    const container = document.getElementById(containerID) || document.body;

    // Create the main widget container
    const widget = document.createElement("div");
    widget.id = "chat-widget";
    widget.style.position = "fixed";
    widget.style.bottom = "20px";
    widget.style.right = "20px";
    widget.style.width = "350px";
    widget.style.height = "500px";
    widget.style.display = "flex";
    widget.style.flexDirection = "column";
    widget.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.1)";
    widget.style.borderRadius = "10px";
    widget.style.overflow = "hidden";
    widget.style.backgroundColor = "#FFFFFF";
    container.appendChild(widget);

    // Create chat window
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style.flex = "1";
    chatWindow.style.overflowY = "scroll";
    chatWindow.style.padding = "10px";
    chatWindow.style.backgroundColor = "#F9F9F9";
    widget.appendChild(chatWindow);

    // Create input area
    const inputArea = document.createElement("div");
    inputArea.style.display = "flex";
    inputArea.style.padding = "10px";
    widget.appendChild(inputArea);

    const userInput = document.createElement("input");
    userInput.id = "user-input";
    userInput.type = "text";
    userInput.placeholder = "Type your message...";
    userInput.style.flex = "1";
    userInput.style.border = "1px solid #CCC";
    userInput.style.borderRadius = "5px";
    userInput.style.padding = "10px";
    inputArea.appendChild(userInput);

    const sendButton = document.createElement("button");
    sendButton.id = "send-button";
    sendButton.textContent = "Send";
    sendButton.style.marginLeft = "10px";
    sendButton.style.padding = "10px 20px";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.backgroundColor = "#007AFF";
    sendButton.style.color = "#FFF";
    sendButton.style.cursor = "pointer";
    inputArea.appendChild(sendButton);

    // Initialize Chat Logic
    initializeChatLogic(apiKey, versionID);
};

// Chat Logic Initialization
const initializeChatLogic = (apiKey, versionID) => {
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    const activeChoices = [];

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

        traces.forEach((trace) => {
            if (trace.type === "text") {
                const message = document.createElement("div");
                message.style.backgroundColor = "#E5E5EA";
                message.style.color = "#000";
                message.style.padding = "10px";
                message.style.margin = "5px 10px";
                message.style.borderRadius = "10px";
                message.style.alignSelf = "flex-start";
                message.innerText = trace.payload.message;
                chatWindow.appendChild(message);
            } else if (trace.type === "choice") {
                const buttonContainer = document.createElement("div");
                buttonContainer.style.display = "flex";
                buttonContainer.style.flexDirection = "column";
                trace.payload.buttons.forEach((button) => {
                    const buttonElement = document.createElement("button");
                    buttonElement.style.margin = "5px 0";
                    buttonElement.style.padding = "10px";
                    buttonElement.style.border = "1px solid #007AFF";
                    buttonElement.style.backgroundColor = "#FFF";
                    buttonElement.style.color = "#007AFF";
                    buttonElement.style.borderRadius = "5px";
                    buttonElement.textContent = button.name;
                    buttonElement.onclick = () => interact(button.request);
                    buttonContainer.appendChild(buttonElement);
                });
                chatWindow.appendChild(buttonContainer);
            }
        });

        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    document.getElementById("send-button").onclick = () => {
        const userInput = document.getElementById("user-input").value;
        if (!userInput) return;
        interact({ type: "text", payload: userInput });
        document.getElementById("user-input").value = "";
    };
};

// Embed the Chat Widget
const config = {
    apiKey: "YOUR_API_KEY", // Replace with your Voiceflow API Key
    versionID: "YOUR_VERSION_ID", // Replace with your Voiceflow Version ID
};
createChatWidget(config);
