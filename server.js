// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // Handle video chat
    socket.on('offer', (data) => {
        socket.to(data.target).emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.to(data.target).emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.target).emit('ice-candidate', data.candidate);
    });

    // Handle text chat
    socket.on('chat-message', (data) => {
        io.emit('chat-message', data);
    });

    // Emit user-connected event when a new user connects
    io.emit('user-connected', socket.id);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
