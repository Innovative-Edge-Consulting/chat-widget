const handleTraces = (traces) => {
  const chatWindow = document.getElementById("chat-window");
  if (!chatWindow) {
    console.error("Chat window not found!");
    return;
  }

  traces.forEach((trace) => {
    console.log("Processing trace:", trace);

    if (trace.type === "text") {
      // Add typing animation
      const typingIndicator = document.createElement("div");
      typingIndicator.classList.add("chat", "incoming");

      const typingContent = document.createElement("div");
      typingContent.classList.add("typing-animation");

      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        typingContent.appendChild(dot);
      }

      typingIndicator.appendChild(typingContent);
      chatWindow.appendChild(typingIndicator);
      chatWindow.scrollTop = chatWindow.scrollHeight;

      // Simulate typing delay
      setTimeout(() => {
        console.log("Typing animation completed. Adding assistant message.");

        // Remove typing indicator
        if (chatWindow.contains(typingIndicator)) {
          chatWindow.removeChild(typingIndicator);
        }

        // Add assistant message
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

        console.log("Assistant message added:", trace.payload.message);
      }, 1500); // Adjust delay as needed
    } else if (trace.type === "choice") {
      console.log("Adding choice buttons.");

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
      console.log("Choice buttons added.");
    }
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
};
