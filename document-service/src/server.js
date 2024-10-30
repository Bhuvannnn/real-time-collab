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
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT,'0.0.0.0', () => {
    console.log(`Document service running on port ${PORT}`);
});

