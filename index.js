import fetch from 'node-fetch'; //start server wth node index.js 
import express from 'express'; // Use ES module import


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); // Middleware to parse JSON requests

let server; // Variable to store server instance
let inactivityTimeout; // Timer for inactivity
const INACTIVITY_LIMIT = 60000; // 1 minute of inactivity (adjust as needed)

// Function to start the server
const startServer = () => {
  if (!server) {
    server = app.listen(PORT, () => {
      console.log(`Proxy server started and listening on http://localhost:${PORT}`);
    });
  }
  resetInactivityTimeout(); // Reset the timer whenever the server starts
};

// Function to stop the server
const stopServer = () => {
  if (server) {
    server.close(() => {
      console.log('Proxy server stopped due to inactivity');
      server = null; // Reset the server variable to indicate it's stopped
    });
  }
};

// Function to reset the inactivity timer
const resetInactivityTimeout = () => {
  if (inactivityTimeout) {
    clearTimeout(inactivityTimeout); // Clear any existing timeout
  }
  inactivityTimeout = setTimeout(() => {
    stopServer(); // Stop the server after a period of inactivity
  }, INACTIVITY_LIMIT);
};

// Function to check current time and conditionally start/stop the server
const checkTimeAndStartServer = () => {
  const now = new Date();
  const startHour = 9; // 9 AM
  const endHour = 12; // 12 PM (noon)
  const timezoneOffset = -5 * 60; // EST offset in minutes (adjust for daylight saving time if needed)

  const currentHour = now.getUTCHours() + timezoneOffset / 60;

  if (currentHour >= startHour && currentHour < endHour) {
    console.log(`Current time is within the operating window (${startHour} AM - ${endHour} PM EST)`);
    startServer();
  } else {
    console.log('Outside of operating hours, server will remain off');
    stopServer();
  }
};

// Check the time periodically to start/stop the server as needed
setInterval(checkTimeAndStartServer, 60 * 1000); // Check every minute

// Route to handle incoming requests
app.all('/api/proxy', async (req, res) => {
  console.log(`Received a ${req.method} request at ${new Date().toISOString()}`); // Log the request method and timestamp

  resetInactivityTimeout(); // Reset the timer on each request

  try {
    const { method, headers, body } = req;
    const targetUrl = 'https://your-external-api.com/endpoint'; // Replace with your target API

    console.log(`Forwarding request to ${targetUrl}`); // Log the target URL

    // Forward the request to the external API
    const response = await fetch(targetUrl, {
      method: method, // Use the same HTTP method
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: method === 'GET' || method === 'HEAD' ? null : JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data); // Forward the response back
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Error fetching data from external API' });
  }
});

// Initial check to start the server
checkTimeAndStartServer();
