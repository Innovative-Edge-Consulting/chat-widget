/* Import Google font - Poppins */
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
  --placeholder-color: #6c6c6c;
  --outgoing-chat-bg: #FFFFFF;
  --incoming-chat-bg: #F7F7F8;
  --outgoing-chat-border: #D9D9D9;
  --incoming-chat-border: #D9D9E3;
  --input-bg: #EDEDED;
}

body {
  background: var(--outgoing-chat-bg);
}

/* Chat container styling */
.chat-container {
  overflow-y: auto;
  max-height: 100vh;
  padding-bottom: 150px;
}

.chat-container .chat {
  padding: 25px 10px;
  display: flex;
  justify-content: center;
  color: var(--text-color);
}

.chat-container .chat.outgoing {
  background: var(--outgoing-chat-bg);
  border: 1px solid var(--outgoing-chat-border);
}

.chat-container .chat.incoming {
  background: var(--incoming-chat-bg);
  border: 1px solid var(--incoming-chat-border);
}

/* Input container styling */
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

.typing-container .typing-content {
  display: flex;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  align-items: flex-end;
}

.typing-container .typing-textarea {
  flex: 1;
  display: flex;
  position: relative;
}

.typing-textarea textarea {
  flex: 1;
  height: 55px;
  padding: 15px 20px;
  border: none;
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 1rem;
}

.typing-textarea textarea::placeholder {
  color: var(--placeholder-color);
}

.typing-textarea span#send-button {
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
