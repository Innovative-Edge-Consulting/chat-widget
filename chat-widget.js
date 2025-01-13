// Revised SIBO-Widget.js

class ChatWidget {
  constructor(config) {
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

    this.apiKey = apiKey;
    this.versionID = versionID;
    this.userId = `user_${Math.random().toString(36).substr(2, 9)}`;

    this.initializeUI(container);
    this.attachEventHandlers();
    this.interact({ type: "launch" });
  }

  initializeUI(container) {
    this.widget = document.createElement("div");
    this.widget.id = "chat-widget";
    container.appendChild(this.widget);

    this.chatWindow = document.createElement("div");
    this.chatWindow.id = "chat-window";
    this.chatWindow.classList.add("chat-container");
    this.widget.appendChild(this.chatWindow);

    this.createTypingArea();
  }

  createTypingArea() {
    const typingContainer = document.createElement("div");
    typingContainer.classList.add("typing-container");
    this.widget.appendChild(typingContainer);

    const typingContent = document.createElement("div");
    typingContent.classList.add("typing-content");
    typingContainer.appendChild(typingContent);

    const typingTextarea = document.createElement("div");
    typingTextarea.classList.add("typing-textarea");
    typingContent.appendChild(typingTextarea);

    this.userInput = document.createElement("textarea");
    this.userInput.id = "user-input";
    this.userInput.placeholder = "Type your message...";
    typingTextarea.appendChild(this.userInput);

    this.sendButton = document.createElement("span");
    this.sendButton.id = "send-button";
    this.sendButton.innerHTML = "send";
    typingTextarea.appendChild(this.sendButton);
  }

  attachEventHandlers() {
    this.sendButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.handleTextInput();
    });

    this.userInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleTextInput();
      }
    });
  }

  async interact(request) {
    try {
      console.log("Sending request:", request);
      const response = await fetch(
        `https://general-runtime.voiceflow.com/state/user/${this.userId}/interact`,
        {
          method: "POST",
          headers: {
            Authorization: this.apiKey,
            "versionID": this.versionID,
            "accept": "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ request }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const traces = await response.json();
      console.log("Received traces:", traces);
      if (traces && traces.length > 0) {
        this.handleTraces(traces);
      } else {
        console.warn("No traces received. Check if Voiceflow has a launch response configured.");
      }
    } catch (error) {
      console.error("Error during interaction:", error);
    }
  }

  handleTraces(traces) {
    traces.forEach((trace) => {
      if (trace.type === "text") {
        this.createBubble(trace.payload.message, "incoming");
      } else if (trace.type === "choice") {
        this.createChoiceButtons(trace.payload.buttons);
      } else if (trace.type === "carousel") {
        this.createCarousel(trace.payload.cards);
      } else {
        console.log("Unhandled trace type:", trace);
      }
    });
    this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
  }

  createBubble(text, type) {
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
    this.chatWindow.appendChild(chatBubble);

    this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
  }

  createChoiceButtons(buttons) {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("choice-container");

    buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("choice-button");
      buttonElement.innerText = button.name;
      buttonElement.onclick = () => {
        this.createBubble(button.name, "outgoing");
        this.interact(button.request);
      };

      buttonContainer.appendChild(buttonElement);
    });

    this.chatWindow.appendChild(buttonContainer);
    this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
  }

createCarousel(cards) {
  const carouselContainer = document.createElement("div");
  carouselContainer.classList.add("carousel-container");

  cards.forEach((card) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("carousel-wrapper"); // Wrapper for card and button

    const cardElement = document.createElement("div");
    cardElement.classList.add("carousel-card");

    // Add Image
    if (card.image) {
      const cardImage = document.createElement("img");
      cardImage.src = card.image;
      cardImage.alt = card.title || "Carousel Image";
      cardElement.appendChild(cardImage);
    }

    // Add Title
    if (card.title) {
      const cardTitle = document.createElement("h5");
      cardTitle.textContent = card.title;
      cardElement.appendChild(cardTitle);
    }

    // Add Description
    if (card.description) {
      const cardDescription = document.createElement("p");
      cardDescription.textContent = this.extractTextFromSlate(card.description);
      cardElement.appendChild(cardDescription);
    }

    cardWrapper.appendChild(cardElement);

    // Add Button
    if (card.buttons && card.buttons.length > 0) {
      card.buttons.forEach((button) => {
        const buttonLabel = button.name;
        const buttonURL = button.request?.payload?.actions?.[0]?.payload?.url;

        if (buttonLabel && buttonURL) {
          const cardButton = document.createElement("a");
          cardButton.textContent = buttonLabel;
          cardButton.href = buttonURL;
          cardButton.target = "_blank"; // Open link in a new tab
          cardButton.classList.add("carousel-button");
          cardWrapper.appendChild(cardButton); // Append button outside the card
        } else {
          console.warn("Invalid button data:", button);
        }
      });
    }

    carouselContainer.appendChild(cardWrapper);
  });

  this.chatWindow.appendChild(carouselContainer);
}


  extractTextFromSlate(description) {
    if (typeof description === "string") {
      return description;
    }

    if (description.slate) {
      return description.slate
        .flatMap((node) => (node.children || []).map((child) => child.text || ""))
        .join(" ");
    }

    return "";
  }

  async handleTextInput() {
    const userInput = this.userInput.value.trim();
    if (!userInput) return;

    this.userInput.value = "";
    this.createBubble(userInput, "outgoing");
    await this.interact({ type: "text", payload: userInput });
  }
}
