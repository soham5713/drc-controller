// server.js - Node.js backend server for ESP32 LED control
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ESP32 IP address (stored in environment variable)
const ESP32_IP = process.env.ESP32_IP || '192.168.31.220';

// Middleware
app.use(cors());
app.use(express.json());

// Route to control the LED
app.get('/api/led', async (req, res) => {
  const { state } = req.query;
  
  if (state !== '0' && state !== '1') {
    return res.status(400).json({ error: 'Invalid state parameter. Must be 0 or 1.' });
  }

  try {
    // Forward the request to the ESP32
    const response = await axios.get(`http://${ESP32_IP}/led?state=${state}`, {
      timeout: 5000 // 5 seconds timeout
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`ESP32 device configured at: ${ESP32_IP}`);
});