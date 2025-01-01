const addUserBubble = (message) => {
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return console.error("Chat window not found!");

    const userMessage = document.createElement("div");
    userMessage.className = "user-bubble";

    // Style the bubble
    userMessage.style.backgroundColor = "#007AFF"; // Blue bubble color
    userMessage.style.color = "#FFF"; // White text
    userMessage.style.padding = "10px 15px"; // Internal padding
    userMessage.style.margin = "5px auto 5px 10px"; // Align to the right with margin
    userMessage.style.borderRadius = "15px"; // Rounded corners
    userMessage.style.maxWidth = "50%"; // Cap bubble width at 50% of chat window
    userMessage.style.width = "auto"; // Auto-adjust width based on text length
    userMessage.style.wordBreak = "break-word"; // Ensure text wraps within the bubble
    userMessage.style.alignSelf = "flex-end"; // Align bubble to the right

    userMessage.innerText = message; // Add the message text
    chatWindow.appendChild(userMessage);

    // Scroll to the bottom of the chat window
    chatWindow.scrollTop = chatWindow.scrollHeight;
};
