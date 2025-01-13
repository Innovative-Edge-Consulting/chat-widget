/* General Reset */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

:root {
  --text-color: #343541;
  --icon-color: #FFFFFF;
  --icon-hover-bg: #5b5e71;
  --placeholder-color: #6c6c6c;
  --outgoing-chat-bg: #FFFFFF;
  --incoming-chat-bg: #F7F7F8;
  --outgoing-chat-border: #D9D9D9;
  --incoming-chat-border: #D9D9D3;
  --input-bg: #EDEDED;
  --scrollbar-color: transparent;
  --button-bg: #007BFF;
  --button-hover-bg: #0056b3;
  --button-border-radius: 50%;
}

body {
  background: var(--outgoing-chat-bg);
}

/* Chat Container */
.chat-container {
  overflow-y: auto;
  max-height: 100vh;
  padding-bottom: 150px;
}

.chat-container::-webkit-scrollbar {
  width: 8px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-track {
  background: var(--scrollbar-color);
}

/* Chat Bubble */
.chat {
  padding: 10px;
  display: flex;
  margin-bottom: 10px;
  color: var(--text-color);
}

.chat.outgoing {
  justify-content: flex-end;
}

.chat.outgoing .chat-content {
  background: var(--outgoing-chat-bg);
  border: 1px solid var(--outgoing-chat-border);
  border-radius: 15px;
  padding: 10px 15px;
  max-width: 80%;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat.incoming .chat-content {
  background: var(--incoming-chat-bg);
  border: 1px solid var(--incoming-chat-border);
  border-radius: 15px;
  padding: 10px 15px;
  max-width: 80%;
  word-wrap: break-word;
}

/* Chat Content */
.chat-content {
  display: flex;
  align-items: flex-start;
}

/* Typing Area */
.typing-container {
  position: fixed;
  bottom: 0;
  width: calc(100% - 20px); /* Subtract padding to avoid overflow */
  max-width: 1200px; /* Ensure it doesn't overflow */
  margin: 0 auto;
  padding: 20px 10px;
  justify-content: center;
  background: var(--outgoing-chat-bg);
  border-top: 1px solid var(--incoming-chat-border);
  box-sizing: border-box; /* Ensures padding doesn't add to total width */
}

.typing-content {
  display: flex;
  width: 100%;
  align-items: flex-end;
}

.typing-textarea {
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
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
  box-sizing: border-box; /* Ensures consistent dimensions */
  margin-right: 10px; /* Ensure proper spacing */
}

.typing-textarea textarea::placeholder {
  color: var(--placeholder-color);
}

/* Send Button */
.typing-textarea #send-button {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1b1f; /* Solid background color */
  color: #ffffff; /* White icon color */
  border-radius: 50%; /* Circular shape */
  cursor: pointer;
  transition: all 0.3s ease; /* Smooth transition */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15); /* Subtle shadow */
  border: none; /* Remove border */
}

.typing-textarea #send-button:hover {
  background: #ffffff; /* White background on hover */
  color: #1a1b1f; /* Button label text color */
  border: 2px solid #1a1b1f; /* Border color set to #1a1b1f */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25); /* Slightly enhanced shadow */
  transform: scale(1.1); /* Enlarge slightly */
}

.typing-textarea #send-button:active {
  transform: scale(0.95); /* Slightly shrink on click */
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2); /* Adjust shadow on click */
}

/* Choice Buttons */
.choice-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.choice-button {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  border: 1px solid var(--text-color);
  border-radius: 4px;
  background-color: var(--incoming-chat-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.choice-button:hover {
  background-color: var(--icon-hover-bg);
  color: #fff;
}

/* Carousel Container */
.carousel-container {
  display: flex;
  flex-wrap: wrap; /* Enable wrapping for cards */
  gap: 15px; /* Consistent spacing between cards */
  padding: 10px;
  justify-content: center; /* Center-align the cards */
}

.carousel-wrapper {
  flex: 0 0 calc(50% - 15px); /* Two cards per row with spacing adjustment */
  display: flex;
  flex-direction: column; /* Stack card and button vertically */
  align-items: center;
}

.carousel-card {
  border: 1px solid var(--incoming-chat-border);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: var(--incoming-chat-bg);
  overflow: hidden;
  padding: 15px;
  display: flex;
  flex-direction: column; /* Ensure vertical stacking */
  align-items: center;
  height: auto; /* Allow height to adjust dynamically based on content */
}

.carousel-card img {
  width: 100%;
  height: auto;
  display: block;
}

.carousel-card h5 {
  font-size: 1rem;
  margin: 10px 0;
  padding-left: 10px; /* Add left padding to the title */
  text-align: left;
  align-self: stretch; /* Ensures alignment spans the width */
  line-height: 1.4; /* Reduce line spacing for wrapped text */
}

.carousel-card p {
  font-size: 0.9rem;
  margin: 10px 0;
  color: var(--placeholder-color);
  text-align: left; /* Left align the paragraph */
  width: 100%; /* Ensure it spans the full width */
}

.carousel-wrapper a.carousel-button {
  display: block;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: var(--button-bg);
  color: #fff;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%; /* Full width button */
}

.carousel-wrapper a.carousel-button:hover {
  background-color: var(--button-hover-bg);
}

/* Responsive Adjustments for Mobile */
@media (max-width: 768px) {
  .carousel-wrapper {
    flex: 0 0 calc(50% - 10px); /* Two cards per row with adjusted spacing */
  }

  .carousel-container {
    gap: 10px; /* Slightly reduced gap for smaller screens */
  }
}
