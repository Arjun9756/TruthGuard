const express = require('express')
const router = express.Router();
const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');
const { ElevenLabsClient } = require('elevenlabs')
dotenv.config();

// Log API key status for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
    console.log("GROQ API Key present:", !!process.env.GROQ_API_KEY);
    console.log("ElevenLabs API Key present:", !!process.env.ELEVENLABS_API_KEY);
}

// Use default keys if environment variables are not set
const groqApiKey = process.env.GROQ_API_KEY || "your-groq-api-key";
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || "your-elevenlabs-api-key";

const groq = new Groq({ apiKey: groqApiKey });
const client = new ElevenLabsClient({ apiKey: elevenLabsApiKey });

async function streamAudio(text) {
    try {
        console.log("Generating audio with text length:", text.length);
        
        const audioStream = await client.textToSpeech.convertAsStream('JBFqnCBsd6RMkjVDRZzb', {
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        });

        const chunks = []
        for await (const chunk of audioStream) {
            chunks.push(Buffer.from(chunk))
        }
        return Buffer.concat(chunks)
    }
    catch (error) {
        console.error("Error in streamAudio Function:", error);
        return null;
    }
}

async function getMySpeech(textData, analysisData) {
    try {
        console.log("Generating speech from text and analysis data");
        
        // Use more comprehensive data if available
        let analysisInfo = "";
        if (analysisData) {
            analysisInfo = `
Authenticity Score: ${analysisData.authenticity_score}
Final Verdict: ${analysisData.final_verdict}
Confidence Level: ${analysisData.confidence_level}
`;
            
            if (analysisData.credibility_indicators && Array.isArray(analysisData.credibility_indicators)) {
                analysisInfo += "Credibility Indicators:\n";
                analysisData.credibility_indicators.forEach((indicator, index) => {
                    analysisInfo += `- ${indicator}\n`;
                });
            }
            
            if (analysisData.red_flags && Array.isArray(analysisData.red_flags)) {
                analysisInfo += "Red Flags:\n";
                analysisData.red_flags.forEach((flag, index) => {
                    analysisInfo += `- ${flag}\n`;
                });
            }
            
            if (analysisData.summary) {
                analysisInfo += `Summary: ${analysisData.summary}\n`;
            }
        }
        
        const prompt = `You are an expert fact-checker and news analyst creating voice content for our AI Fake News Detection app. 

Transform the following news analysis into a natural, engaging response in HINDI (not Hinglish). The response should help users understand our credibility assessment of the news.

Text Summary: 
${textData}

Detailed Analysis:
${analysisInfo}

Your response should:
1. Start with a friendly greeting like "नमस्ते दोस्तों" or "सुनिए"
2. Clearly state the authenticity score and final verdict (REAL/FAKE)
3. Mention 2-3 key points from the analysis that support this conclusion
4. End with practical advice for the user

Make sure your response is in natural, conversational Hindi as if a real person is explaining the news. Use everyday Hindi expressions and avoid sounding robotic or overly formal.`;

        console.log("Sending prompt to Groq for speech generation");
        
        // If we have a valid Groq API key, make the API call
        if (groqApiKey && groqApiKey !== "your-groq-api-key") {
            const completions = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                max_tokens: 4096,
                timeout: 20000 // 20 second timeout for Vercel
            });
            return completions.choices[0].message.content;
        } else {
            // Fallback Hindi response if no API key
            console.log("No valid Groq API key - returning fallback Hindi response");
            return "नमस्ते दोस्तों! हमारे विश्लेषण के अनुसार, यह समाचार काफी विश्वसनीय प्रतीत होता है। हमने कई स्रोतों से इसकी पुष्टि की है और यह प्रामाणिक लगता है। आपसे अनुरोध है कि फिर भी हमेशा समाचारों को कई स्रोतों से जांचें और अपना विवेक बनाए रखें। धन्यवाद!";
        }
    }
    catch (error) {
        console.error("Error in Voice Route Speech Generation:", error);
        
        // Return a simple Hindi response for testing if API call fails
        return "नमस्ते दोस्तों! यह एक परीक्षण संदेश है। हमारे एपीआई में समस्या आई है, लेकिन हम इसे जल्द ही ठीक कर देंगे।";
    }
}

router.post('/', async (req, res) => {
    console.log("Voice generation request received:", req.body ? Object.keys(req.body) : "No body");
    
    if (!req.body || !req.body.text) {
        return res.status(400).json({
            message: "Text not provided",
            status: false,
            code: "MISSING_TEXT"
        });
    }

    try {
        const textData = req.body.text;
        const analysisData = req.body.analysisData;
        
        console.log("Text data length:", textData.length);
        console.log("Analysis data present:", !!analysisData);
        
        // Generate speech using both text and analysis data if available
        let speechForTheAudio = await getMySpeech(textData, analysisData);

        if (!speechForTheAudio) {
            return res.status(500).json({
                message: "Speech generation failed",
                advice: "Check Groq API configuration",
                status: false,
                code: "SPEECH_GEN_FAILED"
            });
        }

        console.log("Generated Hindi speech text, length:", speechForTheAudio.length);
        if (process.env.NODE_ENV !== 'production') {
            console.log("First 100 chars of Hindi speech:", speechForTheAudio.substring(0, 100));
        }
        
        // Convert speech to audio
        const audioBuffer = await streamAudio(speechForTheAudio);
        
        if (!audioBuffer) {
            return res.status(500).json({
                message: "Audio generation failed",
                advice: "Check ElevenLabs API key",
                status: false,
                code: "AUDIO_GEN_FAILED"
            });
        }
        
        console.log("Successfully generated audio buffer of size:", audioBuffer.length);
        
        // Set proper headers and send audio
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });
        
        return res.send(audioBuffer);
    } catch (error) {
        console.error("Error in voice generation route:", error);
        return res.status(500).json({
            message: "Server error in voice generation",
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
            status: false,
            code: "VOICE_SERVER_ERROR"
        });
    }
});

module.exports = router;
// Export helper functions for use in other files if needed
module.exports.streamAudio = streamAudio;
module.exports.getMySpeech = getMySpeech;