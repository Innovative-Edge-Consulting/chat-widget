// Chat Widget Initialization
const createChatWidget = (config) => {
    const {
        apiKey,
        versionID,
        containerID,
        widgetTitle = "Chat Widget",
        sendIcon = "⬆️",
        waitingIcon = "⬜️",
    } = config;

    // Debug: Log Configuration
    console.log("Chat Widget Config:", config);

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
    widget.style.height = "100%";
    widget.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.1)";
    widget.style.borderRadius = "10px";
    widget.style.overflow = "hidden";
    widget.style.backgroundColor = "#FFFFFF";
    container.appendChild(widget);

    console.log("Widget successfully appended to container:", container);

    // Add widget title
    const title = document.createElement("div");
    title.id = "chat-title";
    title.innerText = widgetTitle;
    title.style.backgroundColor = "#007AFF";
    title.style.color = "#FFF";
    title.style.padding = "15px";
    title.style.textAlign = "center";
    title.style.fontWeight = "bold";
    title.style.fontSize = "16px";
    title.style.flexShrink = "0";
    widget.appendChild(title);

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
    inputArea.style.borderTop = "1px solid #CCC";
    inputArea.style.position = "relative";
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
    sendButton.innerHTML = sendIcon;
    sendButton.style.marginLeft = "10px";
    sendButton.style.padding = "10px 20px";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "5px";
    sendButton.style.backgroundColor = "#007AFF";
    sendButton.style.color = "#FFF";
    sendButton.style.cursor = "pointer";
    inputArea.appendChild(sendButton);

    // Debug: Log Initialization Complete
    console.log("Chat widget initialization complete.");

    // Initialize Chat Logic
    initializeChatLogic(apiKey, versionID, sendButton, sendIcon, waitingIcon);
};
