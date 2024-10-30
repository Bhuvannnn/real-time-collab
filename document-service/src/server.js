require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const documentRoutes = require('./routes/documents');


const app = express();

// Connect to MongoDB
connectDB();

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

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT,'0.0.0.0', () => {
    console.log(`Document service running on port ${PORT}`);
});

