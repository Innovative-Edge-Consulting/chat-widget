const createChatWidget = (config) => {
    const { apiKey, versionID, containerID } = config;

    if (!apiKey || !versionID) {
        console.error("Missing API Key or Version ID. Please provide both.");
        return;
    }

    // Ensure container exists
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
    widget.style.height = "100%"; // Full height of parent container
    widget.style.border = "none";
    widget.style.boxShadow = "none";
    widget.style.borderRadius = "10px";
    widget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    widget.style.overflow = "hidden";
    container.appendChild(widget);

    // Create chat window
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style.flex = "1"; // Auto-expand to fill space
    chatWindow.style.overflowY = "scroll"; // Enable scrolling for content
    chatWindow.style.padding = "10px";
    chatWindow.style.backgroundColor = "rgba(249, 249, 249, 0.8)";
    chatWindow.style.display = "flex"; // Proper alignment
    chatWindow.style.flexDirection = "column"; // Stack chat bubbles
    widget.appendChild(chatWindow);

    // Create input area
    const inputArea = document.createElement("div");
    inputArea.style.display = "flex";
    inputArea.style.padding = "10px";
    inputArea.style.borderTop = "1px solid #CCC";
    inputArea.style.flexShrink = "0"; // Prevent shrinking
    widget.appendChild(inputArea);

    const userInput = document.createElement("input");
    userInput.id = "user-input";
    userInput.type = "text";
    userInput.placeholder = "Type your message...";
    userInput.style.flex = "1";
    userInput.style.border = "1px solid #CCC";
    userInput.style.borderRadius = "5px";
    userInput.style.padding = "10px";
    userInput.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
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

    // Debugging Logs
    console.log("Widget and Chat Window created successfully.");

    // Initialize Chat Logic
    initializeChatLogic(apiKey, versionID);
};
