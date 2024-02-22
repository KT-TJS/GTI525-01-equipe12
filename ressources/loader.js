 //Setup de la variable du fichier avec toutes les stations "Station Inventory EN.csv.js"
 var stationInventoryArray = StationInventoryEN.split('\n').map(row => row.split(',')).slice(4);
 stationInventoryArray.pop();
 
 //Setup pour tous les différentes stations en une variable contenant les différentes stations
 for (var key in stations) {
     if (stations.hasOwnProperty(key)) {
         stations[key] = stations[key].split('\n').map(row => row.split(',')).slice(1);
         stations[key].pop();
       }
   }

   //Regarder le résultat de ceci dans un navigateur pour voir le layout.
   console.log(stationInventoryArray);
   console.log(stations);
   
   //Les variables qui sont misent global pour les utiliser dans d'autres fichier javasccript
   window.stationInventoryArray = stationInventoryArray;
   window.stations = stations;