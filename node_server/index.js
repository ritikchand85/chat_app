const io = require("socket.io")(8000); // Initialize Socket.io on port 8000
const users = {}; // Object to store connected users

io.on('connection', socket => {
    // Event: New user joins the chat
    socket.on('new-user-joined', name => {
        console.log("New user joined:", name);
        users[socket.id] = name; // Store user name with socket ID
        socket.broadcast.emit('user-joined', name); // Broadcast to all clients except the sender
    });

    // Event: Send message
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // Event: Disconnect (optional)
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            console.log("User disconnected:", users[socket.id]);
            delete users[socket.id]; // Remove user from the users object upon disconnection
        }
    });
});
