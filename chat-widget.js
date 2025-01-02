const handleTraces = (traces) => {
  const chatWindow = document.getElementById("chat-window");
  if (!chatWindow) return console.error("Chat window not found!");

  traces.forEach((trace) => {
    if (trace.type === "text") {
      // Typing animation
      const typingIndicator = document.createElement("div");
      typingIndicator.classList.add("chat", "incoming");

      const typingContent = document.createElement("div");
      typingContent.classList.add("typing-animation");

      // Add three dots for the typing effect
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        typingContent.appendChild(dot);
      }

      typingIndicator.appendChild(typingContent);
      chatWindow.appendChild(typingIndicator);
      chatWindow.scrollTop = chatWindow.scrollHeight;

      // Simulate typing delay before showing the message
      setTimeout(() => {
        chatWindow.removeChild(typingIndicator); // Remove the typing indicator

        const incomingChat = document.createElement("div");
        incomingChat.classList.add("chat", "incoming");

        const chatContent = document.createElement("div");
        chatContent.classList.add("chat-content");

        const chatDetails = document.createElement("div");
        chatDetails.classList.add("chat-details");

        const message = document.createElement("p");
        message.textContent = trace.payload.message;

        chatDetails.appendChild(message);
        chatContent.appendChild(chatDetails);
        incomingChat.appendChild(chatContent);
        chatWindow.appendChild(incomingChat);
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }, 1500); // Adjust delay as needed
    } else if (trace.type === "choice") {
      const buttonContainer = document.createElement("div");

      trace.payload.buttons.forEach((button) => {
        const buttonElement = document.createElement("button");
        buttonElement.classList.add("choice-button");
        buttonElement.innerText = button.name;
        buttonElement.onclick = () => {
          addUserBubble(button.name);
          interact(button.request);
        };

        buttonContainer.appendChild(buttonElement);
      });

      chatWindow.appendChild(buttonContainer);
    }
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const addUserBubble = (text) => {
  const chatWindow = document.getElementById("chat-window");
  if (!chatWindow) return console.error("Chat window not found!");

  const outgoingChat = document.createElement("div");
  outgoingChat.classList.add("chat", "outgoing");

  const chatContent = document.createElement("div");
  chatContent.classList.add("chat-content");

  const chatDetails = document.createElement("div");
  chatDetails.classList.add("chat-details");

  const message = document.createElement("p");
  message.textContent = text;

  chatDetails.appendChild(message);
  chatContent.appendChild(chatDetails);
  outgoingChat.appendChild(chatContent);
  chatWindow.appendChild(outgoingChat);

  chatWindow.scrollTop = chatWindow.scrollHeight;
};
