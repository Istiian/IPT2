const ChatHead = document.getElementById("ChatHead");
const ChatContainer = document.getElementById("ChatContainer");
const ChatBotContainer = document.getElementsByClassName("ChatBotContainer")[0]

ChatHead.addEventListener("click", () => {
    ChatContainer.classList.toggle("Inactive");
    ChatBotContainer.classList.toggle("Inactive")
});

// Corrected URL for socket.io connection
const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log("Connected to server with socket ID:", socket.id);
});

let loading = null;

const sendMessage = () => {
    const message = document.getElementById("Input");
    socket.emit('SendMessage', message.value); // Emit the correct event
    // Add the user's message to the chat area
    const MessageArea = document.getElementById('MessageArea');
    const newElement = document.createElement('div');
    newElement.className = 'Message Human';
    newElement.innerHTML = message.value;
    MessageArea.appendChild(newElement);

    loading = document.createElement('div');
    loading.className = "loader";
    loading.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    `;
    MessageArea.appendChild(loading);

    MessageArea.scrollTop = MessageArea.scrollHeight;
    message.value = "";
};

// Listen for the correct event emitted by the server
socket.on("ReceiveMessage", (data) => {
    const MessageArea = document.getElementById('MessageArea');

    if (loading && MessageArea.contains(loading)) {
        MessageArea.removeChild(loading);
        loading = null;
    }

    const newElement = document.createElement('div');
    newElement.className = 'Message AI';
    newElement.innerHTML = data;
    MessageArea.appendChild(newElement);
    MessageArea.removeChild(loading);
    MessageArea.scrollTop = MessageArea.scrollHeight;
});


// Define sendMessage globally
