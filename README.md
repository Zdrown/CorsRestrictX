Proxy Server

This is a lightweight Express-based proxy server that forwards requests to an external API and responds with the data it receives. The server can automatically start and stop based on user-defined conditions and supports JSON request/response handling.

Table of Contents

Features
Prerequisites
Installation
Usage
Configuration
Routes
License
Features

Lightweight proxy server using Express.js
Forwards incoming requests to a specified external API
Supports JSON requests and responses
Automatic server inactivity timeout handling
Configurable operating hours (e.g., start/stop server during specific times)
Prerequisites

Node.js (v14 or later recommended)
npm (Node package manager)
Installation

Clone the repository:
git clone https://github.com/Zdrown/CorsRestrictX.git
cd CorsRestrictX
Install dependencies:
npm install
Usage

Start the server:
node index.js
Alternatively, if you have nodemon installed:

nodemon index.js
By default, the server will listen on port 4000. You can modify the PORT variable in the code if needed.
The server forwards requests sent to /api/proxy to the specified external API and returns the response.
Configuration

Operating Hours: The server can be configured to start and stop based on specific operating hours using time-based logic in the code.
Inactivity Timeout: The server stops after a specified period of inactivity (default is 1 minute). This can be modified in the INACTIVITY_LIMIT variable in the code.
Routes

/api/proxy
Description: Forwards incoming requests to an external API and returns the response.
Method: Supports all HTTP methods (e.g., GET, POST, PUT, DELETE)
Request Body: JSON payloads supported for requests that require a body (e.g., POST requests).
Response: Forwards the response received from the external API.
Example Request

Endpoint: http://localhost:4000/api/proxy
Example cURL Command:
curl -X GET http://localhost:4000/api/proxy -H "Content-Type: application/json"
License

This project is licensed under the MIT License.
