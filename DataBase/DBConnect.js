const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

// Improve MongoDB connection options for reliability
const connectionOptions = {
    serverSelectionTimeoutMS: 5000,  // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,         // Close sockets after 45s
    maxPoolSize: 10,                // Maintain up to 10 socket connections
    wtimeoutMS: 2500,               // 2.5 seconds to acknowledge writes
    family: 4                       // Use IPv4, skip trying IPv6
};

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI, connectionOptions);
        console.log("MongoDB Connected Successfully");
        return true;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        
        // On Vercel, we don't want to crash the serverless function
        // If in development, you might want to exit or retry
        if (process.env.NODE_ENV !== 'production') {
            console.error("Full error:", error);
        }
        return false;
    }
}

// Create cached connection for Vercel serverless functions
let cachedConnection = null;

async function getDBConnection() {
    // If we already have a connection, use it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }
    
    // Create a new connection
    cachedConnection = await connectDB();
    return cachedConnection;
}

// Initialize connection when module is loaded
connectDB();

// Export both the regular connection and cached connection function
module.exports = connectDB;
module.exports.getDBConnection = getDBConnection;