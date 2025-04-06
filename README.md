# TruthGuard - AI-Powered Fake News Detection System

## System Architecture
This project implements a sophisticated fake news detection system using a multi-layered approach:

### Backend Architecture (Complexity Level: High)
The backend system is built with multiple interconnected components:

1. **API Layer**
   - Express.js server with modular routing
   - CORS enabled for secure cross-origin requests
   - JWT-based authentication system
   - Rate limiting and request validation

2. **AI Integration Layer**
   - Primary AI: Groq API with Mixtral-8x7b-32768 model
   - Two-stage analysis pipeline:
     - Stage 1: Initial title/content analysis
     - Stage 2: Cross-reference with Google search results

3. **Search Integration**
   - Google Custom Search API integration
   - Real-time web scraping and result parsing
   - Credibility scoring system

4. **Data Processing Pipeline**
```text
News Input → Text Extraction → AI Analysis → Google Search → 
Cross-Reference → Credibility Check → Voice Generation → Final Verdict
```

### Key Features
- Real-time news content analysis
- URL credibility verification
- Authenticity scoring (0-100)
- Warning flags detection
- Confidence level assessment
- Detailed reasoning and verification steps
- Hindi voice analysis for accessibility

### Technical Stack
- **Frontend**: HTML5, TailwindCSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: 
  - Groq API (AI Analysis)
  - Google Custom Search API (Fact Checking)
  - ElevenLabs API (Voice Generation)
- **Authentication**: JWT
- **Deployment**: Netlify (Frontend), Heroku (Backend)

### Security Features
- JWT-based authentication
- API key encryption
- Rate limiting
- Input sanitization
- CORS protection

## API Endpoints

### Authentication Endpoints
```
POST /signup - User registration
POST /login  - User authentication
```

### News Analysis Endpoints
```
POST /ai-news-detect     - Initial AI analysis
POST /ai-news-detect/v2  - Detailed analysis with search results
POST /search            - Google search integration
POST /data             - Main analysis pipeline
POST /voice            - Hindi voice analysis generation
```

### Response Format
```json
{
    "status": true,
    "data": {
        "authenticity_score": 0-100,
        "red_flags": ["array of warnings"],
        "credibility_indicators": ["array of trust factors"],
        "url_credibility": {
            "is_suspicious": boolean,
            "domain_analysis": "string"
        },
        "confidence_level": 0-100,
        "final_verdict": "FAKE/REAL",
        "summary": "string",
        "detailed_reasoning": "string",
        "verification_recommendations": ["array of steps"]
    }
}
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Arjun9756/AI-Fake-News-Detector
cd AI-Fake-News-Detector
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```env
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SEARCH_API_KEY=your_google_search_api_key
SEARCH_ENGINE_ID=your_search_engine_id
IIEVLEVENLABS_API_KEY=your_elevenlabs_api_key
PORT=5000
```

4. Start the server:
```bash
npm start
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License. 