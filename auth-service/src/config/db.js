const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        const uri = process.env.MONGODB_URI.trim();
        
        // Validate connection string format
        if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
            throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
        }

        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string format:', uri.substring(0, 20) + '...' + (uri.includes('@') ? '***@' + uri.split('@')[1].substring(0, 30) : ''));

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000,
        });
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        
        // Provide helpful error messages
        if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
            console.error('\n=== TROUBLESHOOTING TIPS ===');
            console.error('DNS resolution failed. Please check:');
            console.error('1. Your MongoDB Atlas cluster name is correct');
            console.error('2. Your cluster is running (not paused)');
            console.error('3. Network Access allows Render IPs (or 0.0.0.0/0 for all)');
            console.error('4. Connection string format: mongodb+srv://username:password@cluster.mongodb.net/dbname');
            console.error('===========================\n');
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;