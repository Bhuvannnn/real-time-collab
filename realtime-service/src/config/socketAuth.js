// realtime-service/src/config/socketAuth.js
const jwt = require('jsonwebtoken');

const socketAuth = async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        return next(new Error('Authentication required'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        
        // Add user name from token
        socket.userName = decoded.name || `User ${decoded.userId.slice(0, 4)}`;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
};

module.exports = socketAuth;