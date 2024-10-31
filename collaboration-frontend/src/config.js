const config = {
    AUTH_URL: process.env.REACT_APP_AUTH_URL || 'http://localhost:3001',
    DOCUMENT_URL: process.env.REACT_APP_DOCUMENT_URL,
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:3003'
};

export default config;

