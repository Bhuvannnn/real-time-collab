// realtime-service/src/config/socketAuth.js
const jwt = require('jsonwebtoken');
const axios = require('axios');

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            return next(new Error('Authentication required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;

        // Fetch user details from auth service
        try {
            const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
            const response = await axios.get(`${authServiceUrl}/api/auth/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            socket.userName = response.data.name || `User ${decoded.userId.slice(0, 4)}`;
        } catch (error) {
            console.error('Error fetching user details:', error.message);
            socket.userName = `User ${decoded.userId.slice(0, 4)}`;
        }

        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
};

module.exports = socketAuth;