require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
// const cors = require('cors');
const socketAuth = require('./config/socketAuth');
const documentHandlers = require('./socketHandlers/documentHandlers');
const cors = require('cors');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // In production, replace with your frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io middleware
io.use(socketAuth);

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    documentHandlers(io, socket);
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3003;

httpServer.listen(PORT, () => {
    console.log(`Realtime service running on port ${PORT}`);
});