(function () {
  const container = document.getElementById("chat-container");

  if (!container) {
    console.error("Chat container not found!");
    return;
  }

  const config = {
    apiKey: container.getAttribute("data-api-key"),
    versionID: container.getAttribute("data-version-id"),
    containerID: "chat-container",
  };

  if (!config.apiKey || !config.versionID) {
    console.error("Missing API Key or Version ID. Please provide both in the HTML.");
    return;
  }

  const chatWidget = new ChatWidget(config);

  // Test initial interaction
  chatWidget.interact({ type: "launch" }).catch((error) => {
    console.error("Initialization failed:", error);
  });
})();
