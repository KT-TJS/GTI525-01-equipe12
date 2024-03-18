const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');
const fs = require('fs').promises; 
const path = require('path');
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
    console.log(stationMappingData)

  } catch (error) {
    console.error('Error loading station mapping data:', error);
  }

}

// Call the function to load station mapping data when the server starts
loadStationMapping();

/* const cityCode = 'qc-133'; // Replace with the desired city code
fetchCurrentWeather(cityCode)
  .then(data => {
    console.log('Weather data:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

  const station = '5251'; // Replace with the desired stationId
  const annee = '2023'
  const mois = '03'
  const jour = '05'
  fetchClimateDay(station,annee,mois,jour)
  .then(data => {
    console.log('Weather aujourdhui:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  }); */


// Route to handle AJAX requests
app.post('/ajax_endpoint', async (req, res) => {
  try {
   
    const { code } = req.body;

 
    const rssUrl = `https://meteo.gc.ca/rss/city/${code}_f.xml`;
    const response = await axios.get(rssUrl);

   
    res.json({ success: true, data: response.data, stationMapping: stationMappingData });
  } catch (error) {
   
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
});

app.get('/currentWeather', async (req, res) => {
  try {
    // Assuming the city code is passed as a query parameter
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ success: false, error: 'City code is required' });
    }
    const weatherData = await fetchCurrentWeather(code);
    res.json({ success: true, data: weatherData });
  } catch (error) {
    console.error('Error fetching current weather:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch current weather data' });
  }
});
//Retourne prévision pour la journée actuelle
async function fetchCurrentWeather(code) {
  try {
    let rssUrl=findRssFeedByStationId(code);
    console.log(rssUrl);
    //const rssUrl = `https://meteo.gc.ca/rss/city/${code}_f.xml`;
    const response = await axios.get(rssUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}
function findRssFeedByStationId(data) {
  
  for (const key in stationMappingData) {
      if (stationMappingData.hasOwnProperty(key)) {
          const stationInfo = stationMappingData[key]
          //console.log('Comparing: '+data +" with "+ stationInfo.station_ids)
          //console.log(typeof(stationInfo.station_ids))
          for(let i=0;i<stationInfo.station_ids.length;i++){
            if(data==stationInfo.station_ids[i])return stationInfo.rss_feed;
          }
      }
  }
  return null; // Return null if no matching station ID is found
}
//Retourne prévision pour la sation choisie durant le jour choisi (for some reason renvoie le moi au complet meme avec le lien exemple du prof)
async function fetchClimateDay(stationId, year, month, day) {
  try {
      const climateUrl = `https://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=${stationId}&Year=${year}&Month=${month}&Day=${day}&timeframe=1&submit=%20Download+Data`;
      const response = await axios.get(climateUrl);
      return response.data;
  } catch (error) {
      console.error('Error fetching climate data:', error);
      throw new Error('Failed to fetch climate data');
  }
}
//Permet au ressources pour le HTML d'être utiliser
app.use(express.static(path.join(__dirname, '..', '..')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
//ouvre le html quand le server est parti
 res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
});

app.get('/fetchClimateDay', async (req, res) => {
  const { stationId, year, month, day } = req.query;
  try {
    const code = findStationCode(stationId);
    for (const stationId of stationMappingData[code].station_ids) {
      const result = await fetchClimateDay(stationId, year, month, day);
      const parsedData = parseStringIntoArray(result);
      const hourOfDayArray = getDayArrayFromMonthArray(parsedData, day);

      if (hourOfDayArray && hourOfDayArray.length > 0) {
        if (hourOfDayArray[0].hasOwnProperty('9')) {
            if (hourOfDayArray[0][9] != null) {
                res.send(result);
                return;
            }
        } else {
            console.error("Property '9' does not exist in the first element of hourOfDayArray");
        }
      } else {
          console.error("hourOfDayArray is either undefined or empty");
      }
    }
    res.status(500).json({ success: false, error: 'Failed to fetch climate data' });
  } catch (error) {
    console.error('Error fetching climate data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch climate data' });
  }
});

// Function to find the station code based on station ID
function findStationCode(stationId) {
  const idToFind = parseInt(stationId);
  for (const code in stationMappingData) {
    const station = stationMappingData[code];
    if (station.station_ids.includes(idToFind)) {
      return code;
    }
  }
  return null; // Station code not found for the given station ID
}

//transforme la reponse de l'api qui est en string en un array utilisable
function parseStringIntoArray(data) {
  const rows = data.split('\n');

  // Initialize an array to hold parsed data
  const parsedData = [];

  // Iterate over rows
  rows.forEach(row => {
      // Split each row by comma to get columns
      const columns = row.split(',');
  
      // Remove leading and trailing whitespace from each column
      const trimmedColumns = columns.map(col => col.trim());
  
      // Push the trimmed columns to the parsedData array
      parsedData.push(trimmedColumns);
  });
  return parsedData;
}

function getDayArrayFromMonthArray(parsedData, day) {
  const filteredData = [];
  for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      var timeLSTString;
      if (row[7] !== undefined) {
          timeLSTString = row[7].replace(/^"(.*)"$/, '$1');
      }
      const timeLST = parseFloat(timeLSTString);
      if (timeLST == day) {
          filteredData.push(row);
      }
  }
  return filteredData;
}