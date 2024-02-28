const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');
const fs = require('fs').promises; // Importing the 'fs' module for file operations

const app = express();
const port = 8080;

let stationMappingData;
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Load the station mapping JSON file
async function loadStationMapping() {
  try {
    const data = await fs.readFile('station_mapping.json', 'utf8');
    stationMappingData = JSON.parse(data);
    console.log('Station mapping data loaded successfully.');
  } catch (error) {
    console.error('Error loading station mapping data:', error);
  }
}

// Call the function to load station mapping data when the server starts
loadStationMapping();

const cityCode = '1865'; // Replace with the desired city code
fetchWeatherData(cityCode)
  .then(data => {
    console.log('Weather data:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Route to handle AJAX requests
app.post('/ajax_endpoint', async (req, res) => {
  try {
    // Assuming the AJAX request sends some JSON data with a 'code' field
    const { code } = req.body;

    // Fetching data from the API using Axios
    const rssUrl = `https://meteo.gc.ca/rss/city/${code}_f.xml`;
    const response = await axios.get(rssUrl);

    // Sending the fetched data back to the client along with station mapping data
    res.json({ success: true, data: response.data, stationMapping: stationMappingData });
  } catch (error) {
    // Handling errors
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
});


async function fetchWeatherData(code) {
  try {
    const rssUrl = `https://meteo.gc.ca/rss/city/${code}_f.xml`;
    const response = await axios.get(rssUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});