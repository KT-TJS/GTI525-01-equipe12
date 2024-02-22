const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Route to handle AJAX requests
app.post('/ajax_endpoint', (req, res) => {
  // Assuming the AJAX request sends some JSON data
  const requestData = req.body;

  // Process the request data (you can perform any desired operations here)
  console.log('Received AJAX request:', requestData);

  // Sending a response back
  res.json({ message: 'Request received successfully', data: requestData });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});