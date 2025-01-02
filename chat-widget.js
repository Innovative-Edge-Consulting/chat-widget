/* Updated CSS for user bubbles */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

:root {
  --text-color: #343541;
  --icon-color: #ACACBE;
  --icon-hover-bg: #5b5e71;
  --placeholder-color: #6c6c6c; /* Dark grey for better visibility */
  --outgoing-chat-bg: #FFFFFF; /* White chat background */
  --incoming-chat-bg: #F7F7F8; /* Light grey incoming message background */
  --outgoing-chat-border: #D9D9D9;
  --incoming-chat-border: #D9D9D3;
  --input-bg: #EDEDED; /* Light grey input field background */
}

body {
  background: var(--outgoing-chat-bg);
}

.chat-container {
  overflow-y: auto;
  max-height: 100vh;
  padding-bottom: 150px;
}

:where(.chat-container, textarea)::-webkit-scrollbar {
  width: 6px;
}

:where(.chat-container, textarea)::-webkit-scrollbar-track {
  background: var(--incoming-chat-bg);
  border-radius: 25px;
}

:where(.chat-container, textarea)::-webkit-scrollbar-thumb {
  background: var(--icon-color);
  border-radius: 25px;
}

.chat {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.chat.outgoing {
  background: var(--outgoing-chat-bg);
  border: 1px solid var(--outgoing-chat-border);
  border-radius: 12px;
  max-width: 50%;
  align-self: flex-end;
  word-wrap: break-word;
}

.chat.incoming {
  background: var(--incoming-chat-bg);
  border: 1px solid var(--incoming-chat-border);
  border-radius: 12px;
  max-width: 50%;
  align-self: flex-start;
  word-wrap: break-word;
}

.chat-content {
  padding: 10px;
}

.typing-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 20px 10px;
  justify-content: center;
  background: var(--outgoing-chat-bg);
  border-top: 1px solid var(--incoming-chat-border);
}

.typing-textarea textarea {
  flex: 1;
  height: 55px;
  border: none;
  padding: 15px 20px;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 1rem;
  border-radius: 4px;
  box-sizing: border-box;
  width: 100%;
}

.typing-textarea span#send-button {
  flex-shrink: 0;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-hover-bg);
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
}
