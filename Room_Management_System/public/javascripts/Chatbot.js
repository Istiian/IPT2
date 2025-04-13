const ChatHead = document.getElementById("ChatHead");
const ChatContainer = document.getElementById("ChatContainer");

ChatHead.addEventListener("click", () => {
    ChatContainer.classList.toggle("Inactive");
});

// Corrected URL for socket.io connection
const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log("Connected to server with socket ID:", socket.id);
});

// Listen for the correct event emitted by the server
socket.on("ReceiveMessage", (data) => {
    const MessageArea = document.getElementById('MessageArea');
    
    // const newElement = document.createElement('div');
    // newElement.className = 'Message AI';
    // newElement.innerHTML = data;
    const loading =  document.createElement('div')
    loading.className = "loader";
    loading.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    `
    MessageArea.appendChild(loading);
    MessageArea.scrollTop = MessageArea.scrollHeight;

    setTimeout(()=>{
        const newElement = document.createElement('div');
        newElement.className = 'Message AI';
        newElement.innerHTML = data;
        MessageArea.appendChild(newElement);
        MessageArea.removeChild(loading);
        MessageArea.scrollTop = MessageArea.scrollHeight;
    }, 1500)
});

// Define sendMessage globally
const sendMessage = () => {
    const message = document.getElementById("Input");
    socket.emit('SendMessage', message.value); // Emit the correct event
    

    // Add the user's message to the chat area
    const MessageArea = document.getElementById('MessageArea');
    const newElement = document.createElement('div');
    newElement.className = 'Message Human';
    newElement.innerHTML = message.value;
    MessageArea.appendChild(newElement);
    MessageArea.scrollTop = MessageArea.scrollHeight;
    message.value = "";
};