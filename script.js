const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

// ⚠️ Paste your OpenAI API key here for testing (DO NOT publish this key publicly!)
const OPENAI_API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your key

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, 'user');
  input.value = '';
  appendMessage('Typing...', 'bot', true); // show temporary message

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";

  removeTyping();
  appendMessage(reply, 'bot');
});

// Add message to chat box
function appendMessage(message, sender, isTemp = false) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = message;
  if (isTemp) msg.setAttribute("id", "temp");
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove the "Typing..." temp message
function removeTyping() {
  const temp = document.getElementById("temp");
  if (temp) chatBox.removeChild(temp);
}
