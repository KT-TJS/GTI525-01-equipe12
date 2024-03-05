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
    console.log(4)
    console.log(typeof stationMappingData)
    console.log(stationMappingData)

  } catch (error) {
    console.error('Error loading station mapping data:', error);
  }

}

// Call the function to load station mapping data when the server starts
loadStationMapping();

const cityCode = 'qc-133'; // Replace with the desired city code
fetchWeatherData(cityCode)
  .then(data => {
    console.log('Weather data:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

  const station = '51457'; // Replace with the desired stationId
  const annee = '2023'
  const mois = '03'
  const jour = '05'
  fetchClimateData(station,annee,mois,jour)
  .then(data => {
    console.log('Weather aujourdhui:', data);
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

//Retourne prévision pour la journée actuelle
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

async function fetchClimateData(stationId, year, month, day) {
  try {
      const climateUrl = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${stationId}&Year=${year}&Month=${month}&Day=${day}&timeframe=1&submit=%20Download+Data`;
      const response = await fetch(climateUrl);
      const data = await response.text();
      return data;
  } catch (error) {
      console.error('Error fetching climate data:', error);
      throw new Error('Failed to fetch climate data');
  }
}


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});