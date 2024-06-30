const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio notification setup
var audio = new Audio('notify.mp3');

// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // Scroll to the bottom of the chat container
    messageContainer.scrollTop = messageContainer.scrollHeight;
    
    // Play audio notification if message is from the left (incoming message)
    if (position === 'left') {
        console.log('Sound is playing');
        audio.play();
    }
};

// Prompt user for name when they join the chat
const name = prompt("Enter your name to join AD-Chat");
socket.emit('new-user-joined', name);

// Handle form submission (sending messages)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim(); // Trim whitespace from message
    if (message) {
        append(`You: ${message}`, 'right'); // Display sent message on right side
        socket.emit('send', message); // Emit 'send' event with message content
        messageInput.value = ''; // Clear input field after sending
    }
});

// Socket event: User joined the chat
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right'); // Display joined message on right side
});

// Socket event: Receive message from another user
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left'); // Display received message on left side
});
