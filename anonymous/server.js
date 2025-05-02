const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Queue for waiting users
const waitingQueue = [];
const activePairs = new Map();

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New user connected');

    // Handle user joining the queue
    socket.on('joinQueue', () => {
        if (waitingQueue.length > 0) {
            const partner = waitingQueue.shift();
            const roomId = `${socket.id}-${partner.id}`;
            
            // Join both users to the same room
            socket.join(roomId);
            partner.join(roomId);
            
            // Store the pair
            activePairs.set(socket.id, { partner: partner.id, roomId });
            activePairs.set(partner.id, { partner: socket.id, roomId });
            
            // Notify both users
            io.to(roomId).emit('chatStarted');
        } else {
            waitingQueue.push(socket);
            socket.emit('waitingForPartner');
        }
    });

    // Handle messages
    socket.on('message', (data) => {
        const pair = activePairs.get(socket.id);
        if (pair) {
            io.to(pair.roomId).emit('message', {
                text: data.text,
                timestamp: new Date().toISOString()
            });
        }
    });

    // Handle typing indicator
    socket.on('typing', () => {
        const pair = activePairs.get(socket.id);
        if (pair) {
            socket.to(pair.roomId).emit('typing');
        }
    });

    // Handle chat ending
    socket.on('endChat', () => {
        const pair = activePairs.get(socket.id);
        if (pair) {
            io.to(pair.roomId).emit('chatEnded');
            activePairs.delete(socket.id);
            activePairs.delete(pair.partner);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const pair = activePairs.get(socket.id);
        if (pair) {
            io.to(pair.roomId).emit('partnerDisconnected');
            activePairs.delete(socket.id);
            activePairs.delete(pair.partner);
        }
        // Remove from waiting queue if present
        const index = waitingQueue.indexOf(socket);
        if (index !== -1) {
            waitingQueue.splice(index, 1);
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 