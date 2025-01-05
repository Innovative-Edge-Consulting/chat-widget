// script.js
document.getElementById("execute-button").addEventListener("click", () => {
  const userInput = document.getElementById("user-input").value.trim();
  if (userInput) {
    console.log(`User prompt: ${userInput}`);
    alert(`Executing prompt: ${userInput}`);
  } else {
    alert("Please enter a prompt.");
  }
});
