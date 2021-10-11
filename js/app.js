const formMessage = document.querySelector("#new-message");
const containerMessages = document.querySelector("#container-messages");

let messages = [];

eventListeners();

function eventListeners() {
  document.addEventListener("DOMContentLoaded", loadMessages);
  formMessage.addEventListener("submit", addMessage);
}

function loadMessages() {
  showMessages();
}

function addMessage(e) {
  e.preventDefault();

  const message = document.querySelector("#new-message-value").value;
  if (message == "") {
    showError("Empty message");
    return;
  }

  formMessage.reset();

  // Get messages of local storage
  messages = [...messages, { id: Date.now(), message }];

  syncStorage();
  showMessages();
}

function showError(error) {
  const errorTitle = document.querySelector("#error-title");
  errorTitle.classList.add("error");
  errorTitle.textContent = error;

  setTimeout(() => {
    errorTitle.classList.remove("error");
    errorTitle.textContent = "Messages";
  }, 1500);
}

function showMessages() {
  const messages = JSON.parse(localStorage.getItem("messages"));
  containerMessages.innerHTML = '<p class="my-messages__title">My messages</p>';
  messages.forEach((obj) => {
    const btn = document.createElement("i");
    btn.className = "bi bi-x-circle-fill card-message__icon";
    btn.title = "Delete message";
    btn.onclick = () => {
      deleteMessage(obj.id);
    };

    const card = document.createElement("article");
    card.className = "card-message";
    card.innerHTML = `${obj.message}`;

    card.appendChild(btn);

    if (containerMessages.classList.contains("lock")) {
      containerMessages.classList.remove("lock");
    }

    containerMessages.appendChild(card);
  });
}

function syncStorage() {
  localStorage.setItem("messages", JSON.stringify(messages));
}

function deleteMessage(id) {
  messages = JSON.parse(localStorage.getItem("messages"));
  messages = messages.filter((e) => e.id !== id);
  messages = messages;

  syncStorage();
  showMessages();

  showError("Message deleted");

  // Change height of container
  if (messages.length === 0) {
    containerMessages.classList.add("lock");
  }
}
