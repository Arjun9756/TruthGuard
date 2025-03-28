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

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'version'],
    credentials: true
}));

app.options('*', cors());

app.get('/' , (req , res)=>{
    res.status(200).json({
        message:'Truth Guard API is running'
    })
})

app.use('/login' , Login)

app.use('/ai-news-detect' , AINewsDetect)

app.use('/signup' , Signup)
app.use('/data' , DataExtractor)
app.use('/search' , SearchAPI)
app.use('/getaudio' , VoiceGenerate)

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

module.exports = app