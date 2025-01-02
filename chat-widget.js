const handleTraces = (traces) => {
  const chatWindow = document.getElementById("chat-window");
  if (!chatWindow) return console.error("Chat window not found!");

  traces.forEach((trace) => {
    if (trace.type === "text") {
      const incomingChat = document.createElement("div");
      incomingChat.classList.add("chat", "incoming");

      const chatContent = document.createElement("div");
      chatContent.classList.add("chat-content");

      const chatDetails = document.createElement("div");
      chatDetails.classList.add("chat-details");

      const message = document.createElement("p");
      message.textContent = ""; // Initially empty for typing animation
      chatDetails.appendChild(message);
      chatContent.appendChild(chatDetails);
      incomingChat.appendChild(chatContent);
      chatWindow.appendChild(incomingChat);

      // Typing effect
      const fullMessage = trace.payload.message;
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < fullMessage.length) {
          message.textContent += fullMessage[charIndex];
          charIndex++;
        } else {
          clearInterval(typingInterval);
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }, 50); // Typing speed in milliseconds
    } else if (trace.type === "choice") {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");

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

  const charCount = text.length;
  const bubbleWidth = Math.min(50, Math.ceil(charCount / 2)) + "%"; // Dynamic width
  message.style.maxWidth = bubbleWidth;

  chatDetails.appendChild(message);
  chatContent.appendChild(chatDetails);
  outgoingChat.appendChild(chatContent);
  chatWindow.appendChild(outgoingChat);

  chatWindow.scrollTop = chatWindow.scrollHeight;
};
