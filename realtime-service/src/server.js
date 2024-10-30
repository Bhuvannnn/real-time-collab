require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const socketAuth = require('./config/socketAuth');
const documentHandlers = require('./socketHandlers/documentHandlers');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// Middleware
app.use(cors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

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
httpServer.listen(PORT,'0.0.0.0', () => {
    console.log(`Realtime service running on port ${PORT}`);
});