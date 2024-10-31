// document-service/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const documentRoutes = require('./routes/documents');

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration with proper options
app.use(cors({
    origin: '*',  // Temporarily allow all origins to test
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Add preflight handling
app.options('*', cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        path: req.path,
        origin: req.headers.origin,
        headers: req.headers
    });
    next();
});

app.use(express.json());
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Document service running on port ${PORT}`);
});