// Stability AI API integration
// This code should be used in a Node.js backend environment

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { Buffer } = require('buffer');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Stability AI API endpoint
const STABILITY_API_BASE_URL = 'https://api.stability.ai/v1/generation';

// API Routes
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      engine = 'stable-diffusion-xl-1024-v1-0',
      cfgScale = 7,
      steps = 30,
      width = 1024,
      height = 1024,
      samples = 1
    } = req.body;

    // Validate inputs
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get API key from environment variable
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Make request to Stability AI API
    const response = await axios({
      method: 'post',
      url: `${STABILITY_API_BASE_URL}/${engine}/text-to-image`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: cfgScale,
        steps: steps,
        width: width,
        height: height,
        samples: samples
      }
    });

    // Process and save images
    const images = [];
    
    if (response.data && response.data.artifacts) {
      for (let i = 0; i < response.data.artifacts.length; i++) {
        const artifact = response.data.artifacts[i];
        const imageBuffer = Buffer.from(artifact.base64, 'base64');
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `image_${timestamp}_${i}.png`;
        const filePath = path.join(uploadsDir, filename);
        
        // Save the image to disk
        fs.writeFileSync(filePath, imageBuffer);
        
        // Add image to the response
        images.push({
          url: `/uploads/${filename}`,
          seed: artifact.seed,
          finishReason: artifact.finishReason
        });
      }
    }

    // Return the image URLs and metadata
    return res.json({
      success: true,
      images,
      engine,
      prompt
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Handle API-specific errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.message || 'Error from Stability AI API'
      });
    }
    
    return res.status(500).json({
      error: 'Failed to generate image'
    });
  }
});

// Get available engines
app.get('/api/engines', async (req, res) => {
  try {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await axios.get('https://api.stability.ai/v1/engines/list', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching engines:', error);
    return res.status(500).json({ error: 'Failed to fetch engines' });
  }
});

// Serve the main application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
