const config = {
    PORT: process.env.PORT || 3002,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL
};

module.exports = config;