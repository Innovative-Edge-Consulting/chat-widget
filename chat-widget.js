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

  const inputContainer = document.createElement("div");
  inputContainer.id = "input-container";
  inputContainer.classList.add("input-container");
  widget.appendChild(inputContainer);

  const userInput = document.createElement("textarea");
  userInput.id = "user-input";
  userInput.placeholder = "Type your message...";
  inputContainer.appendChild(userInput);

  const sendButton = document.createElement("span");
  sendButton.id = "send-button";
  sendButton.innerHTML = "send";
  inputContainer.appendChild(sendButton);

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
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return console.error("Chat window not found!");

    traces.forEach((trace) => {
      if (trace.type === "text") {
        createAssistantText(trace.payload.message);
      } else if (trace.type === "choice") {
        createChoiceButtons(trace.payload.buttons);
      }
    });

    chatWindow.scrollTop = chatWindow.scrollHeight;
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

    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  const createAssistantText = (text) => {
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return console.error("Chat window not found!");

    const assistantText = document.createElement("p");
    assistantText.classList.add("assistant-text");
    assistantText.textContent = text;

    chatWindow.appendChild(assistantText);
    chatWindow.scrollTop = chatWindow.scrollHeight;
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
