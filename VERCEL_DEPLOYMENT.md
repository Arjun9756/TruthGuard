# Vercel Deployment Guide for TruthGuard Backend

This document provides instructions for deploying the TruthGuard backend API to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- Git installed on your machine

## Steps to Deploy

1. **Push your code to GitHub**

   Make sure your code is pushed to a GitHub repository.

2. **Connect to Vercel**

   - Log in to your Vercel account
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Other
     - Root Directory: `./` (if the backend is in the root, otherwise specify the path)
     - Build Command: `npm run vercel-build`
     - Output Directory: `./`
     - Install Command: `npm install`

3. **Configure Environment Variables**

   Add the following environment variables in the Vercel project settings:

   ```
   API_URL = [your-vercel-deployment-url]
   PORT = 8080
   JWT_SECRET = [your-jwt-secret]
   GROQ_API_KEY = [your-groq-api-key]
   SEARCH_ENGINE_ID = [your-search-engine-id]
   SEARCH_API_KEY = [your-search-api-key]
   MONGO_URI = [your-mongodb-connection-string]
   OPEN_AI_API_KEY = [your-openai-api-key]
   ELEVENLABS_API_KEY = [your-elevenlabs-api-key]
   ```

4. **Deploy**

   Click "Deploy" and wait for the deployment to complete.

5. **Test the Deployment**

   Once deployed, test your API by accessing:
   
   ```
   https://[your-project-name].vercel.app/
   ```

   You should see a message that says "Truth Guard API is running"

## Updating the Frontend

After deployment, update your frontend code to use the Vercel deployment URL:

1. Find all instances where you're using `http://localhost:5000` or any other local URL
2. Replace with your Vercel deployment URL (e.g., `https://truthguard-backend.vercel.app`)

## Troubleshooting

- If you encounter errors, check the Vercel deployment logs
- Make sure all environment variables are correctly set
- Verify that your `vercel.json` file is properly configured
- Ensure your MongoDB database allows connections from Vercel IP addresses

## Important Notes

- The free tier of Vercel has limitations on serverless function execution time
- For production use with high traffic, consider upgrading to a paid plan
- Vercel handles SSL and domain configuration automatically 