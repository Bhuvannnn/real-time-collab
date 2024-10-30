require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const connectDB = require('./config/db');
const documentRoutes = require('./routes/documents');
const cors = require('cors');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Document service running on port ${PORT}`);
});

