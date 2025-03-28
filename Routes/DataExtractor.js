const express = require('express')
const router = express.Router()
const tokenVerify = require('../MiddleWares/TokenVerify')
const dotenv = require('dotenv')
const { detectNews, detectNewsFromGoogle, cleanJsonString } = require('./AINewsDetect')
const { searchGoogle } = require('./SearchAPI')
dotenv.config()

function extractNewsLink(text) {
    if (!text) return [];

    const urlRegex = /(https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)))/gi;

    let links = text.match(urlRegex) || [];

    links = links.map(link => {
        return link.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]+$/, '');
    }).filter(link => {
        return link && link.length > 0;
    });

    return [...new Set(links)];
}

router.get('/', (req, res) => {
    res.status(200).json({
        message: "This is GET Request Make Post Request",
        status: true
    })
})

router.post('/', tokenVerify, async (req, res) => {
    try {
        let text = req.body.text
        if (!text) {
            return res.status(400).json({
                message: "News Text is Required",
                status: false
            })
        }

        let newsLinks = extractNewsLink(text)
        let textwithoutLink = text

        newsLinks.forEach(link => {
            textwithoutLink = textwithoutLink.replace(link, '').trim()
        })

        // Call the detectNews function directly instead of making an API call
        let result = await detectNews(textwithoutLink, newsLinks[0] || "")
        console.log("AI Title Result:", result)

        if (!result) {
            return res.status(500).json({
                message: "Error in detecting news title",
                status: false,
                advice: "Please Contact Backend Developer Its an Server Error",
                AI_RESPONSE: "Failed to Detect News AI Error"
            })
        }

        // Clean up the query by removing quotes
        const cleanQuery = result.replace(/["']/g, '').trim()
        console.log("Clean search query:", cleanQuery)

        // Call searchGoogle directly instead of making an API call
        let googleSearchResult = await searchGoogle(cleanQuery, 2)
        console.log("Google search result:", googleSearchResult)

        if (!googleSearchResult || !googleSearchResult.success) {
            return res.status(500).json({
                message: "Error in searching news",
                status: false,
                advice: "Please Contact Backend Developer Its an Server Error",
                AI_RESPONSE: "Failed to Search News AI Error"
            })
        }

        // Format Google search results in the same way as the SearchAPI
        let googleSearchObjectData = []
        let objectOfData = googleSearchResult.result || []
        for(let i=0; i < objectOfData.length; i++) {
            googleSearchObjectData.push(objectOfData[i].snippet)
        }

        let formattedSearchResults = {
            data: googleSearchObjectData,
            totalResults: googleSearchResult.totalResults,
            searchTime: googleSearchResult.searchTime
        }

        // Call detectNewsFromGoogle directly instead of making an API call
        let detectionResult = await detectNewsFromGoogle(textwithoutLink, newsLinks[0] || "", formattedSearchResults)
        
        // Process the result as before
        try {
            // Use imported cleanJsonString function to clean and parse the result
            const cleanedJsonString = cleanJsonString(detectionResult);
            const cleanedResult = JSON.parse(cleanedJsonString);
            
            if (cleanedResult) {
                return res.status(200).json({
                    status: true,
                    data: cleanedResult
                })
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            console.error("Raw response:", detectionResult);
            return res.status(500).json({
                message: "Failed to parse AI response",
                status: false,
                error: parseError.message,
                rawResponse: detectionResult
            });
        }

        return res.status(500).json({
            status: false,
            message: "Error in detecting news",
            advice: "Please Contact Backend Developer Its an Server Error",
            AI_RESPONSE: "Failed to Detect News AI Error"
        })
    } catch (error) {
        console.error("Uncaught error in DataExtractor:", error)
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        })
    }
})

module.exports = router
// Export the extractNewsLink function for use in other files
module.exports.extractNewsLink = extractNewsLink