const addUserBubble = (message) => {
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return console.error("Chat window not found!");

    // Ensure the parent container is correctly styled
    chatWindow.style.display = "flex"; // Set as a flex container
    chatWindow.style.flexDirection = "column"; // Stack bubbles vertically

    const userMessage = document.createElement("div");
    userMessage.className = "user-bubble";

    // Style the bubble
    userMessage.style.backgroundColor = "#007AFF"; // Blue bubble color
    userMessage.style.color = "#FFF"; // White text
    userMessage.style.padding = "10px 15px"; // Internal padding
    userMessage.style.margin = "5px 0 5px auto"; // Align to the right with auto on the left
    userMessage.style.borderRadius = "15px"; // Rounded corners
    userMessage.style.maxWidth = "50%"; // Cap bubble width at 50% of chat window
    userMessage.style.width = "fit-content"; // Auto-adjust width based on text length
    userMessage.style.wordBreak = "break-word"; // Ensure text wraps within the bubble
    userMessage.style.textAlign = "left"; // Align text inside the bubble

    userMessage.innerText = message; // Add the message text
    chatWindow.appendChild(userMessage);

    // Scroll to the bottom of the chat window
    chatWindow.scrollTop = chatWindow.scrollHeight;
};
