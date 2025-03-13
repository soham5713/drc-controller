// server.js - Node.js backend server for ESP32 LED control
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ESP32 URL from environment variable
const ESP32_URL = process.env.ESP32_URL || 'http://drccontroller.ddns.net:8080';

// Middleware
app.use(cors());
app.use(express.json());

// Root route (homepage)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>ESP32 LED Control API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          code {
            background: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
          }
          .endpoint {
            background: #f8f8f8;
            border-left: 4px solid #4CAF50;
            padding: 10px 15px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <h1>ESP32 LED Control API</h1>
        <p>This server acts as a proxy between your frontend application and your ESP32 device.</p>
        
        <h2>Available Endpoints:</h2>
        
        <div class="endpoint">
          <h3>GET /api/health</h3>
          <p>Check if the API server is running</p>
          <p>Example: <code>${req.protocol}://${req.get('host')}/api/health</code></p>
        </div>
        
        <div class="endpoint">
          <h3>GET /api/led?state=1|0</h3>
          <p>Control the LED state on the ESP32</p>
          <p>Example: <code>${req.protocol}://${req.get('host')}/api/led?state=1</code> (to turn on)</p>
        </div>
        
        <div class="endpoint">
          <h3>GET /api/status</h3>
          <p>Get the current status of the LED</p>
          <p>Example: <code>${req.protocol}://${req.get('host')}/api/status</code></p>
        </div>
        
        <p>Server Status: Running</p>
        <p>ESP32 configured at: ${ESP32_URL}</p>
      </body>
    </html>
  `);
});

// Route to control the LED
app.get('/api/led', async (req, res) => {
  const { state } = req.query;
  
  if (state !== '0' && state !== '1') {
    return res.status(400).json({ error: 'Invalid state parameter. Must be 0 or 1.' });
  }

  try {
    // Forward the request to the ESP32
    const response = await axios.get(`${ESP32_URL}/led?state=${state}`, {
      timeout: 10000 // 10 seconds timeout
    });
    
    // Return the ESP32's response to the client
    res.status(response.status).send(response.data);
    
    console.log(`LED state changed to ${state === '1' ? 'FLASHING' : 'OFF'}`);
  } catch (error) {
    console.error('Error communicating with ESP32:', error.message);
    
    // Provide a more helpful error message based on the error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return res.status(503).json({ error: 'ESP32 device is not reachable. Please check if it is powered on and connected to the network.' });
    }
    
    res.status(500).json({ error: 'Failed to communicate with ESP32 device.' });
  }
});

// Route to get the LED status
app.get('/api/status', async (req, res) => {
  try {
    // Forward the request to the ESP32
    const response = await axios.get(`${ESP32_URL}/status`, {
      timeout: 5000 // 5 seconds timeout
    });
    
    // Return the ESP32's response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error getting ESP32 status:', error.message);
    res.status(500).json({ error: 'Failed to get ESP32 status.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`ESP32 device configured at: ${ESP32_URL}`);
});