// Chat Widget Initialization
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
  // You can optionally add a theme class like `light-mode` if you want:
  // widget.classList.add("light-mode");
  container.appendChild(widget);

  // Create the chat window (the scrolling area)
  // Map this to your `.chat-container` in CSS
  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-window";
  chatWindow.classList.add("chat-container");
  widget.appendChild(chatWindow);

  // Create the input area (mapped to `.typing-container` in CSS)
  const typingContainer = document.createElement("div");
  typingContainer.classList.add("typing-container");
  widget.appendChild(typingContainer);

  // Create the "typing-content" container
  const typingContent = document.createElement("div");
  typingContent.classList.add("typing-content");
  typingContainer.appendChild(typingContent);

  // Create the "typing-textarea" container, which will hold our input
  const typingTextarea = document.createElement("div");
  typingTextarea.classList.add("typing-textarea");
  typingContent.appendChild(typingTextarea);

  // Create the user input
  const userInput = document.createElement("textarea");
  userInput.id = "user-input";
  userInput.placeholder = "Type your message...";
  typingTextarea.appendChild(userInput);

  // Create a send button
  const sendButton = document.createElement("span");
  sendButton.id = "send-button";
  // Using Material Symbols or any icon set you want
  // you can also use an HTML entity or an actual icon
  sendButton.innerHTML = "send"; // or: "&#9654;";
  typingTextarea.appendChild(sendButton);

  // Optionally, you could create a separate controls area if you have more buttons
  // For now, we only have one button (send)

  // Initialize Chat Logic
  initializeChatLogic(apiKey, versionID);
};

// Chat Logic Initialization
const initializeChatLogic = (apiKey, versionID) => {
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
  let activeChoices = [];

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

    // Clear active choices on each new set of messages
    activeChoices = [];

    traces.forEach((trace) => {
      if (trace.type === "text") {
        // Create an assistant message (incoming chat)
        // sample CSS expects a structure like:
        // <div class="chat incoming">
        //   <div class="chat-content">
        //     <div class="chat-details">
        //       <p>message text here</p>
        //     </div>
        //   </div>
        // </div>
        const incomingChat = document.createElement("div");
        incomingChat.classList.add("chat", "incoming");

        const chatContent = document.createElement("div");
        chatContent.classList.add("chat-content");

        const chatDetails = document.createElement("div");
        chatDetails.classList.add("chat-details");

        const message = document.createElement("p");
        message.textContent = trace.payload.message;

        // Append nested elements
        chatDetails.appendChild(message);
        chatContent.appendChild(chatDetails);
        incomingChat.appendChild(chatContent);
        chatWindow.appendChild(incomingChat);
      } else if (trace.type === "choice") {
        // Choice buttons
        const buttonContainer = document.createElement("div");
        // You may style this container with its own class, e.g. "button-container"
        // or rely on your global `.chat-container` + something else.
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

          // Add to active choices for input matching
          activeChoices.push({
            label: button.name.toLowerCase(),
            request: button.request,
          });
        });

        // You can insert this into the chat as an incoming block if you prefer
        // For simplicity, we’ll just append the container directly:
        chatWindow.appendChild(buttonContainer);
      }
    });

    // Scroll to bottom after messages
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  const addUserBubble = (text) => {
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return console.error("Chat window not found!");

    // Create user message (outgoing chat)
    // Per sample CSS:
    // <div class="chat outgoing">
    //   <div class="chat-content">
    //     <div class="chat-details">
    //       <p>text</p>
    //     </div>
    //   </div>
    // </div>
    const outgoingChat = document.createElement("div");
    outgoingChat.classList.add("chat", "outgoing");

    const chatContent = document.createElement("div");
    chatContent.classList.add("chat-content");

    const chatDetails = document.createElement("div");
    chatDetails.classList.add("chat-details");

    const message = document.createElement("p");
    message.textContent = text;

    // Assemble
    chatDetails.appendChild(message);
    chatContent.appendChild(chatDetails);
    outgoingChat.appendChild(chatContent);
    chatWindow.appendChild(outgoingChat);

    // Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  const handleTextInput = async () => {
    const userInputElem = document.getElementById("user-input");
    const userInput = userInputElem.value.trim();
    if (!userInput) return;

    // Match input with choice buttons
    const matchedChoice = activeChoices.find(
      (choice) => choice.label === userInput.toLowerCase()
    );

    if (matchedChoice) {
      addUserBubble(matchedChoice.label);
      await interact(matchedChoice.request);
    } else {
      addUserBubble(userInput);
      await interact({ type: "text", payload: userInput });
    }

    userInputElem.value = "";
  };

  // Hook up send button
  document.getElementById("send-button").onclick = (event) => {
    event.preventDefault();
    handleTextInput();
  };

  // Send on Enter
  document.getElementById("user-input").onkeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleTextInput();
    }
  };

  // Launch the conversation
  interact({ type: "launch" });
};
