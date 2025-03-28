const express = require('express')
const app = express()
const dotenv = require('dotenv')
const DataExtractor = require('./Routes/DataExtractor')
const cors = require('cors')
const db = require('./DataBase/DBConnect')
const Login = require('./Routes/Login')
const Signup = require('./Routes/Signup')
const AINewsDetect = require('./Routes/AINewsDetect')
const SearchAPI = require('./Routes/SearchAPI')
const VoiceGenerate = require('./Routes/Voice_Generate')

// Load environment variables
dotenv.config()

// Application middleware
app.use(express.json({ limit: '2mb' })) // Increased limit for larger payloads
app.use(express.urlencoded({ extended: true }))

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'version'],
    credentials: true
}));

app.options('*', cors());

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        status: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Truth Guard API is running',
        version: '1.0.0',
        status: true
    });
});

// All API routes
app.use('/login', Login)
app.use('/ai-news-detect', AINewsDetect)
app.use('/signup', Signup)
app.use('/data', DataExtractor)
app.use('/search', SearchAPI)
app.use('/getaudio', VoiceGenerate)

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        status: false
    });
});

// Server start for local development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    });
}

module.exports = app