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
    widget.style.maxHeight = "100vh"; // Prevents widget from exceeding viewport height
    widget.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.1)";
    widget.style.borderRadius = "10px";
    widget.style.overflow = "hidden";
    widget.style.backgroundColor = "#FFFFFF";
    container.appendChild(widget);

    // Create chat window
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style.flex = "1";
    chatWindow.style.overflowY = "auto"; // Enables scrolling within the chat window
    chatWindow.style.padding = "10px";
    chatWindow.style.backgroundColor = "#F9F9F9";
    widget.appendChild(chatWindow);

    // Create input area
    const inputArea = document.createElement("div");
    inputArea.style.display = "flex";
    inputArea.style.padding = "10px";
    inputArea.style.borderTop = "1px solid #CCC";
    inputArea.style.flexShrink = "0"; // Prevent shrinking of the input area
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
