const config = {
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    DOCUMENT_URL: process.env.REACT_APP_DOCUMENT_URL || 'http://localhost:3002',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:3003',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};
module.exports = config;