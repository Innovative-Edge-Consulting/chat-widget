// Chat Widget Initialization
const createChatWidget = (config) => {
  const { apiKey, versionID, containerID } = config;

  if (!apiKey || !versionID) {
    console.error("Missing API Key or Version ID. Please provide both.");
    return;
  }

  const container = document.getElementById(containerID);
  if (!container) {
    console.error(`Container with ID "${containerID}" not found!`);
    return;
  }

  const widget = document.createElement("div");
  widget.id = "chat-widget";
  container.appendChild(widget);

  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-window";
  chatWindow.classList.add("chat-container");
  widget.appendChild(chatWindow);

  const typingContainer = document.createElement("div");
  typingContainer.classList.add("typing-container");
  widget.appendChild(typingContainer);

  const typingContent = document.createElement("div");
  typingContent.classList.add("typing-content");
  typingContainer.appendChild(typingContent);

  const typingTextarea = document.createElement("div");
  typingTextarea.classList.add("typing-textarea");
  typingContent.appendChild(typingTextarea);

  const userInput = document.createElement("textarea");
  userInput.id = "user-input";
  userInput.placeholder = "Type your message...";
  typingTextarea.appendChild(userInput);

  const sendButton = document.createElement("span");
  sendButton.id = "send-button";
  sendButton.innerHTML = "send";
  typingTextarea.appendChild(sendButton);

  initializeChatLogic(apiKey, versionID);
};

// Chat Logic Initialization
const initializeChatLogic = (apiKey, versionID) => {
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;

  const interact = async (request) => {
    try {
      const response = await fetch(
        `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
        {
          method: "POST",
          headers: {
            Authorization: apiKey,
            versionID,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request }),
        }
      );

      const traces = await response.json();
      handleTraces(traces);
    } catch (error) {
      console.error("Error interacting with Voiceflow:", error);
    }
  };

  const handleTraces = (traces) => {
    traces.forEach((trace) => {
      if (trace.type === "text") {
        createAssistantText(trace.payload.message);
      } else if (trace.type === "choice") {
        createChoiceButtons(trace.payload.buttons);
      }
    });

    adjustScroll();
  };

  const createBubble = (text, type) => {
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return console.error("Chat window not found!");

    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat", type);

    const chatContent = document.createElement("div");
    chatContent.classList.add("chat-content");

    const chatDetails = document.createElement("div");
    chatDetails.classList.add("chat-details");

    const message = document.createElement("p");
    message.textContent = text;

    chatDetails.appendChild(message);
    chatContent.appendChild(chatDetails);
    chatBubble.appendChild(chatContent);
    chatWindow.appendChild(chatBubble);

    adjustScroll();
  };

  const createAssistantText = (text) => {
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return console.error("Chat window not found!");

    const assistantText = document.createElement("p");
    assistantText.classList.add("assistant-text");
    assistantText.textContent = text;

    chatWindow.appendChild(assistantText);

    adjustScroll();
  };

  const createChoiceButtons = (buttons) => {
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return console.error("Chat window not found!");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("choice-container");

    buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("choice-button");
      buttonElement.innerText = button.name;
      buttonElement.onclick = () => {
        createBubble(button.name, "outgoing");
        interact(button.request);
      };

      buttonContainer.appendChild(buttonElement);
    });

    chatWindow.appendChild(buttonContainer);

    adjustScroll();
  };

  const adjustScroll = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  const handleTextInput = async () => {
    const userInputElem = document.getElementById("user-input");
    const userInput = userInputElem.value.trim();
    if (!userInput) return;

    userInputElem.value = "";
    createBubble(userInput, "outgoing");
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

  interact({ type: "launch" });
};
