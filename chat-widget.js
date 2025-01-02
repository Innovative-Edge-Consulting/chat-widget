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
      message.textContent = trace.payload.message;

      chatDetails.appendChild(message);
      chatContent.appendChild(chatDetails);
      incomingChat.appendChild(chatContent);
      chatWindow.appendChild(incomingChat);
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

const handleTextInput = async () => {
  const userInputElem = document.getElementById("user-input");
  const userInput = userInputElem.value.trim();
  if (!userInput) return;

  addUserBubble(userInput);

  userInputElem.value = "";
  await interact({ type: "text", payload: userInput });
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
