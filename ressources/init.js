var structuredData = {};
processStations(stations,stationInventoryArray);
initializeStationList();
function processStations(stationsObject, stationInventoryArray) {
    const stationIds = Object.keys(stationsObject);
    // Iterate through each station ID
    stationIds.forEach(stationId => {
        const stationName = stationsObject[stationId];
        var cid = parseInt(stationId, 10);
        
        stationInventoryArray.forEach(stationItem => {
            if (stationItem[3] != null) {
                let cleanedString = stationItem[3].replace(/"/g, '');
                const sid = parseInt(cleanedString, 10);
                // Check for matching station ID
                if (sid === cid) {
                    if (!structuredData[stationItem[1]]) {
                        structuredData[stationItem[1]] = [];
                    }
                    var cleanName = stationItem[1];
                    // Add the station to the province
                
                    structuredData[cleanName.toString()].push({
                        name: stationItem[0].replace(/"/g, ''),
                        code: stationItem[5].replace(/"/g, ''),
                        id: sid
                    });
                }
            }
        });
    });
    temp = [];
    temp.push(stations[stationIds[0]][0]);
    populateMeteoDataTable(temp,true);

}
function initializeStationList() {
    const stationList = document.querySelector('.stationList');

    // Clear existing list items
    while (stationList.firstChild) {
        stationList.removeChild(stationList.firstChild);
    }

    // Create All Stations list
    const allStationsLi = document.createElement('li');
    const allStationsSpan = document.createElement('span');
    allStationsSpan.textContent = "Toutes les stations";
    allStationsLi.appendChild(allStationsSpan);

    // Create sublist for All Stations
    const allStationsSubList = document.createElement('ul');
    allStationsSubList.classList.add('stationSubList');
   
    allStationsSpan.addEventListener("click",function (event){
        event.stopPropagation();
        });
    allStationsLi.appendChild(allStationsSubList);
    stationList.appendChild(allStationsLi);
    var sortedObject = {};

    // Get all keys of the original object, sort them alphabetically, 
    // and then iterate over them
    Object.keys(structuredData).sort().forEach(key => {
        sortedObject[key] = structuredData[key];
    });
    structuredData = sortedObject;
    Object.keys(structuredData).forEach(key => {
        if (Array.isArray(structuredData[key])) {
            structuredData[key].sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }
    });
    // Iterate over each province in structuredData
    Object.keys(structuredData).forEach(provinceName => {
        const stationss = structuredData[provinceName];
        const provinceLi = document.createElement('li');
        const provinceSpan = document.createElement('span');
        provinceSpan.textContent = provinceName.replace(/"/g, '');
        provinceLi.appendChild(provinceSpan);

        const stationSubList = document.createElement('ul');
        stationSubList.classList.add('stationSubList');

        provinceSpan.addEventListener("click",function (event){
            event.stopPropagation();
            });
        // Iterate over each station in the province
        
        stationss.forEach(station => {
            const stationLi = document.createElement('li');
            const dataStr = `${station.name} - (${station.code})`;
            stationLi.textContent = dataStr;
        
            // Create a handler function
            const clickHandler = function(event) {
                event.stopPropagation();
                console.log("pressed on " + dataStr);
                loadStationDetails(station.id, dataStr);
            };
            stationLi.addEventListener('click', clickHandler);
            const clone = stationLi.cloneNode(true);
            clone.addEventListener('click', clickHandler);
            allStationsSubList.appendChild(clone);
            stationSubList.appendChild(stationLi);
        });
        provinceLi.appendChild(stationSubList);
        stationList.appendChild(provinceLi);
    });
    //Reorders things around
    let listItems = Array.from(allStationsSubList.querySelectorAll('li'));
    listItems.sort((a, b) => a.textContent.localeCompare(b.textContent));
    listItems.forEach(item => allStationsSubList.appendChild(item));

    
}

//USES GLOBAL STATIONS
function loadStationDetails(stationId,name) {
    initPlageDate(stations[stationId]);
    intermediaryFunction(stations[stationId],stationId);
    const infoTitle = document.querySelector('.stationInfoTitle');
    const buttonReset = document.querySelector('.allData');
    infoTitle.textContent = name;

    //put the current "active" stationId in a global variable so it's accessible everywhere which station is active (used in main.js)  
    window.currentStation = stationId;
    var tbody = document.getElementById("weatherData");

    var dateElement = document.getElementById("dailyInfoDateSelection");
    const selectedDate = dateElement.value;
    if(selectedDate != ""){
        getDailyInfo();
    }
    
    buttonReset.addEventListener('click', function(event){
        event.preventDefault();
        loadStationDetails(stationId,name)});
    
}

//Enters all the dates and Year provided by the elements
function initPlageDate(dataList){
    const fieldNames = dataList[0];
    const dataObjects = dataList.slice(1);
    const yearLi = [];
    const monthLi = [];
    dataObjects.forEach(dataObject => {
        const year = insertData('"Year"');
        const month = insertData('"Month"');
        function insertData(name){
            return dataObject[fieldNames.indexOf(name)].replace(/"/g, '');
        }

        if (!yearLi.includes(year.toString())) {
            yearLi.push(year.toString());
        }
        if (!monthLi.includes(month.toString())) {
            monthLi.push(month.toString());
        }
    });
    const fromYear = document.querySelector('#stationStartTimeYear');
    const fromMonth = document.querySelector('#stationStartTimeMonth');
    const endYear = document.querySelector('#stationEndTimeYear');
    const endMonth = document.querySelector('#stationEndTimeMonth');

    while (fromYear.firstChild) {
        fromYear.removeChild(fromYear.firstChild);
    }
    while (fromMonth.firstChild) {
        fromMonth.removeChild(fromMonth.firstChild);
    }
    while (endYear.firstChild) {
        endYear.removeChild(endYear.firstChild);
    }
    while (endMonth.firstChild) {
        endMonth.removeChild(endMonth.firstChild);
    }
    yearLi.forEach(year =>{
        const newOption = document.createElement('option');
        newOption.textContent = year;
        newOption.value = year;
        const clone = newOption.cloneNode(true);
        fromYear.appendChild(newOption);
        endYear.appendChild(clone);
        
    });
    const convertMonth = ["Janvier",'Fevrier',"Mars",'Avril',"May",'Juin',"Juillet",'Aout',"Septembre",'Octobre',"Novembre",'Decembre'];
    monthLi.forEach(month =>{
        
        const newOption = document.createElement('option');
        newOption.textContent = convertMonth[month-1];
        newOption.value = month;
        const clone = newOption.cloneNode(true);
        fromMonth.appendChild(newOption);
        endMonth.appendChild(clone);
    });
    endYear.selectedIndex = endYear.options.length -1;
    endMonth.selectedIndex = endMonth.options.length -1;
    //Onclick events for when date is changed// integrade some logic for stats
    fromYear.addEventListener('change', function(){intermediaryFunction(dataList)});
    fromMonth.addEventListener('change', function(){intermediaryFunction(dataList)});
    endYear.addEventListener('change', function(){intermediaryFunction(dataList)});
    endMonth.addEventListener('change', function(){intermediaryFunction(dataList)});



}
function intermediaryFunction(dataList,stationid=undefined){

    populateMeteoDataTable(dataList);
    populateMeteoStatTable(dataList);
    populateMeteoMonthTable(dataList);
    if(stationid!=undefined)populateMeteoFeedTable(stationid);

}
//DataList is the provided MeteoStation from the click event found in the loadStationDetails
function populateMeteoDataTable(dataList,isCreation=false) {
    // Extracting the names of the first row that contains the CSV associated elements
    const fieldNames = dataList[0];
    const dataObjects = dataList.slice(0);

    // Clears all the table except for the first table row which contains the names
    let tableBody = document.querySelector('.meteoData table');
    if(!isCreation){
        tableBody=document.querySelector('.meteoData table tbody');
    if (tableBody && tableBody.rows.length > 0) {
        for (let i = tableBody.rows.length - 1; i >= 0; i--) {
            tableBody.deleteRow(i);
        }
    }
    //Logic for time check
    const fromYear = document.querySelector('#stationStartTimeYear');
    const fromMonth = document.querySelector('#stationStartTimeMonth');
    const endYear = document.querySelector('#stationEndTimeYear');
    const endMonth = document.querySelector('#stationEndTimeMonth');
    const dateStart = new Date(fromYear.value,fromMonth.value-1);
    const dateEnd = new Date(endYear.value,endMonth.value-1);
    // Iterate over the data objects to create table rows
    dataObjects.forEach(dataObject => {
        // Create a new row
        const year = parseInt(insertData('"Year"'));
        const month = parseInt(insertData('"Month"'));
        const date = new Date(year,month-1);

        if(((date-dateStart)>=0&&(dateEnd-date>=0))){ //Logic for time check end
            const row = tableBody.insertRow();
            const yearCell = row.insertCell(); yearCell.textContent = insertData('"Year"');
            const monthCell = row.insertCell();monthCell.textContent = insertData('"Month"');
            const meanMaxTempCell = row.insertCell(); meanMaxTempCell.textContent = insertData('"Mean Max Temp (°C)"');
            const meanMinTempCell = row.insertCell(); meanMinTempCell.textContent = insertData('"Mean Min Temp (°C)"');
            const meanTempCell = row.insertCell(); meanTempCell.textContent = insertData('"Mean Temp (°C)"');
            const extrMaxTempCell = row.insertCell(); extrMaxTempCell.textContent = insertData('"Extr Max Temp (°C)"');
            const extrMinTempCell = row.insertCell(); extrMinTempCell.textContent = insertData('"Extr Min Temp (°C)"');
            const totalRainCell = row.insertCell(); totalRainCell.textContent = insertData('"Total Rain (mm)"');
            const totalSnowCell = row.insertCell(); totalSnowCell.textContent = insertData('"Total Snow (cm)"');
            const maxWindSpeedCell = row.insertCell(); maxWindSpeedCell.textContent = insertData('"Spd of Max Gust (km/h)"');
        }

        function insertData(name){
            if (dataObject[fieldNames.indexOf(name)].replace(/"/g, '')== '') return '';
            return dataObject[fieldNames.indexOf(name)].replace(/"/g, '');
        }
    });}
    else{
        let table=document.querySelector(".meteoData table");
        table.createTHead();
        table.createTBody();
        let tableHead=table.querySelector("thead");
        let temp=document.createElement("th");
        dataObjects.forEach(dataObject => {

            // Create a new row
            let row = tableHead.insertRow();
            let temp=document.createElement("th");
            let yearCell = row.appendChild(temp); yearCell.textContent = insertData('"Year"');
            temp=document.createElement("th");
            let monthCell = row.appendChild(temp);monthCell.textContent = insertData('"Month"');
            temp=document.createElement("th");
            let meanMaxTempCell = row.appendChild(temp); meanMaxTempCell.textContent = insertData('"Mean Max Temp (°C)"');
            temp=document.createElement("th");
            let meanMinTempCell = row.appendChild(temp); meanMinTempCell.textContent = insertData('"Mean Min Temp (°C)"');
            temp=document.createElement("th");
            let meanTempCell = row.appendChild(temp); meanTempCell.textContent = insertData('"Mean Temp (°C)"');
            temp=document.createElement("th");
            let extrMaxTempCell = row.appendChild(temp); extrMaxTempCell.textContent = insertData('"Extr Max Temp (°C)"');
            temp=document.createElement("th");
            let extrMinTempCell = row.appendChild(temp); extrMinTempCell.textContent = insertData('"Extr Min Temp (°C)"');
            temp=document.createElement("th");
            let totalRainCell = row.appendChild(temp); totalRainCell.textContent = insertData('"Total Rain (mm)"');
            temp=document.createElement("th");
            let totalSnowCell = row.appendChild(temp); totalSnowCell.textContent = insertData('"Total Snow (cm)"');
            temp=document.createElement("th");
            let maxWindSpeedCell = row.appendChild(temp); maxWindSpeedCell.textContent = insertData('"Spd of Max Gust (km/h)"');


            function insertData(name){
                if (dataObject[fieldNames.indexOf(name)].replace(/"/g, '') == '') return '';
                return dataObject[fieldNames.indexOf(name)].replace(/"/g, '');
            }
        });

    }
}
function populateMeteoMonthTable(dataList,isCreation=false) {
    // Extracting the names of the first row that contains the CSV associated elements
    const fieldNames = dataList[0];
    const dataObjects = dataList.slice(1);

    // Clears all the table except for the first table row which contains the names
    let tableDiv = document.querySelector('.meteoDataStat');
    tableDiv.innerHTML= '';
    //Logic for time check
    const fromYear = document.querySelector('#stationStartTimeYear');
    const fromMonth = document.querySelector('#stationStartTimeMonth');
    const endYear = document.querySelector('#stationEndTimeYear');
    const endMonth = document.querySelector('#stationEndTimeMonth');
    const dateStart = new Date(fromYear.value,fromMonth.value-1);
    const dateEnd = new Date(endYear.value,endMonth.value-1);
    // Iterate over the data objects to create table rows
    const convertMonth = ["Janvier",'Fevrier',"Mars",'Avril',"May",'Juin',"Juillet",'Aout',"Septembre",'Octobre',"Novembre",'Decembre'];
    convertMonth.forEach(months => {

        var maxMeanTemp = 0;
        var maxMeanTempYear = fromYear.value;
        var minMeanTemp = 111110;
        var minMeanTempYear = fromYear.value;
        var maxExtTemp = 0;
        var maxExtTempYear = fromYear.value;
        var minExtTemp = 11111111;
        var minExtTempYear = fromYear.value;
        var maxRain = 0;
        var maxRainYear = fromYear.value;
        var minRain = 1111110;
        var minRainYear = fromYear.value;
        var maxSnow = 0;
        var maxSnowYear = fromYear.value;
        var minSnow = 11111110;
        var minSnowYear = fromYear.value;
        var maxWind = 0;
        var maxWindYear = fromYear.value;
        var minWind = 1111111110;
        var minWindYear = fromYear.value;

        dataObjects.forEach(dataObject => {
            const year = parseInt(insertData('"Year"'));
            const month = parseInt(insertData('"Month"'));
            const date = new Date(year,month-1);
            function insertData(name){
                if (dataObject[fieldNames.indexOf(name)].replace(/"/g, '')== '') return null;
                return dataObject[fieldNames.indexOf(name)].replace(/"/g, '');
            }

            
            if(((date-dateStart)>=0&&(dateEnd-date>=0))&&(months==convertMonth[month-1])){
                var tempMaxMeanTemp = parseFloat(insertData('"Mean Max Temp (°C)"'))
                var tempMinMeanTemp = parseFloat(insertData('"Mean Min Temp (°C)"'))
                var tempMaxExtTemp = parseFloat(insertData('"Extr Max Temp (°C)"'))
                var tempMinExtTemp = parseFloat(insertData('"Extr Min Temp (°C)"'))
                var tempRain = parseFloat(insertData('"Total Rain (mm)"'))
                var tempSnow = parseFloat(insertData('"Total Snow (cm)"'))
                var tempWind = parseFloat(insertData('"Spd of Max Gust (km/h)"'))
                if(tempMaxMeanTemp>maxMeanTemp){
                    maxMeanTemp = tempMaxMeanTemp;
                    maxMeanTempYear = year;
                }
                if (tempMinMeanTemp <= minMeanTemp) {
                    minMeanTemp = tempMinMeanTemp;
                    minMeanTempYear = year;
                }
        
                if (tempMaxExtTemp >= maxExtTemp) {
                    maxExtTemp = tempMaxExtTemp;
                    maxExtTempYear = year;
                }
        
                if (tempMinExtTemp <= minExtTemp) {
                    minExtTemp = tempMinExtTemp;
                    minExtTempYear = year;
                }
        
                if (tempRain >= maxRain) {
                    maxRain = tempRain;
                    maxRainYear = year;
                }
        
                if (tempRain <= minRain) {
                    minRain = tempRain;
                    minRainYear = year;
                }
        
                if (tempSnow >= maxSnow) {
                    maxSnow = tempSnow;
                    maxSnowYear = year;
                }
        
                if (tempSnow <= minSnow) {
                    minSnow = tempSnow;
                    minSnowYear = year;
                }
        
                if (tempWind >= maxWind) {
                    maxWind = tempWind;
                    maxWindYear = year;
                }
        
                if (tempWind <= minWind) {
                    minWind = tempWind;
                    minWindYear = year;
                }
            }



        });

        const tableBody  = document.createElement('table');
        tableBody.createTHead();
        const header = document.createElement('h1');
        header.textContent = months;
        tableDiv.appendChild(header);
        tableDiv.appendChild(tableBody);

        const row = tableBody.insertRow();
        temp=document.createElement("th");
        const typeCell = row.appendChild(temp);     typeCell.textContent = "Donnée";
        temp=document.createElement("th");
        const maxCell = row.appendChild(temp);      maxCell.textContent = "Valeur maximale";
        temp=document.createElement("th");
        const maxYearCell = row.appendChild(temp);  maxYearCell.textContent = "Année";
        temp=document.createElement("th");
        const minCell= row.appendChild(temp);      minCell.textContent = "Valeur Minimale";
        temp=document.createElement("th");
        const minYearCell = row.appendChild(temp);  minYearCell.textContent = "Année";

         //Logic for time check end
        const row1 = tableBody.insertRow();
        const typeCell1 = row1.insertCell();      typeCell1.textContent     = "Température moyenne mensuelle";
        const maxCell1 = row1.insertCell();       maxCell1.textContent      = maxMeanTemp +"ºC " ;
        const maxYearCell1 = row1.insertCell();   maxYearCell1.textContent  = maxMeanTempYear ;
        const minCell1= row1.insertCell();       minCell1.textContent       = (minMeanTemp<1000 ? minMeanTemp:0) + "ºC ";
        const minYearCell1 = row1.insertCell();   minYearCell1.textContent  = minMeanTempYear;

        const row2 = tableBody.insertRow();
        const typeCell2 = row2.insertCell();      typeCell2.textContent      = "Température extrême";
        const maxCell2 = row2.insertCell();       maxCell2.textContent      = maxExtTemp + "ºC ";
        const maxYearCell2 = row2.insertCell();   maxYearCell2.textContent  = maxExtTempYear ;
        const minCell2= row2.insertCell();       minCell2.textContent       = (minExtTemp<1000 ? minExtTemp:0) + "ºC ";
        const minYearCell2 = row2.insertCell();   minYearCell2.textContent  = minExtTempYear;

        const row3 = tableBody.insertRow();
        const typeCell3 = row3.insertCell();      typeCell3.textContent     = "Quantitée de pluie";
        const maxCell3 = row3.insertCell();       maxCell3.textContent      = maxRain + "cm ";
        const maxYearCell3 = row3.insertCell();   maxYearCell3.textContent  = maxRainYear ;
        const minCell3= row3.insertCell();        minCell3.textContent      = (minRain<1000 ? minRain:0) + "cm ";
        const minYearCell3 = row3.insertCell();   minYearCell3.textContent  = minRainYear ;

        const row4 = tableBody.insertRow();
        const typeCell4 = row4.insertCell();      typeCell4.textContent     = "Quantité de neige";
        const maxCell4 = row4.insertCell();       maxCell4.textContent      = maxSnow + "cm ";
        const maxYearCell4 = row4.insertCell();   maxYearCell4.textContent  = maxSnowYear ;
        const minCell4= row4.insertCell();       minCell4.textContent       = (minSnow<1000 ? minSnow:0) + "cm ";
        const minYearCell4= row4.insertCell();   minYearCell4.textContent   = minSnowYear;

        const row5 = tableBody.insertRow();
        const typeCell5 = row5.insertCell();      typeCell5.textContent     = "Vitesse du vent";
        const maxCell5 = row5.insertCell();       maxCell5.textContent      = maxWind + "Km/h";
        const maxYearCell5 = row5.insertCell();   maxYearCell5.textContent  = maxWindYear ;
        const minCell5= row5.insertCell();       minCell5.textContent       = (minWind<1000 ? minWind:0) + "Km/h";
        const minYearCell5 = row5.insertCell();   minYearCell5.textContent  = minWindYear ;

        
    });
}

function populateMeteoStatTable(dataList,isCreation=false) {
    // Extracting the names of the first row that contains the CSV associated elements
    const fieldNames = dataList[0];
    const dataObjects = dataList.slice(1);

    // Clears all the table except for the first table row which contains the names
    let tableDiv = document.querySelector('.meteoDataStatGlob');
    tableDiv.innerHTML= '';
    //Logic for time check
    const fromYear = document.querySelector('#stationStartTimeYear');
    const fromMonth = document.querySelector('#stationStartTimeMonth');
    const endYear = document.querySelector('#stationEndTimeYear');
    const endMonth = document.querySelector('#stationEndTimeMonth');
    const dateStart = new Date(fromYear.value,fromMonth.value-1);
    const dateEnd = new Date(endYear.value,endMonth.value-1);
    // Iterate over the data objects to create table rows
    const convertMonth = ["Janvier",'Fevrier',"Mars",'Avril',"May",'Juin',"Juillet",'Aout',"Septembre",'Octobre',"Novembre",'Decembre'];
    
        // Create a new row
        // const year = parseInt(insertData('"Year"'));
        // const month = parseInt(insertData('"Month"'));
        // const date = new Date(year,month-1);
        var maxMeanTemp = 0;
        var maxMeanTempYear = fromYear.value;
        var maxMeanTempMonth = 1;
        var minMeanTemp = 111110;
        var minMeanTempYear = fromYear.value;
        var minMeanTempMonth = 1;
        var maxExtTemp = 0;
        var maxExtTempYear = fromYear.value;
        var maxExtTempMonth = 1;
        var minExtTemp = 11111111;
        var minExtTempYear = fromYear.value;
        var minExtTempMonth = 1;
        var maxRain = 0;
        var maxRainYear = fromYear.value;
        var maxRainMonth = 1;
        var minRain = 1111110;
        var minRainYear = fromYear.value;
        var minRainMonth = 1;
        var maxSnow = 0;
        var maxSnowYear = fromYear.value;
        var maxSnowMonth = 1;
        var minSnow = 11111110;
        var minSnowYear = fromYear.value;
        var minSnowMonth = 1;
        var maxWind = 0;
        var maxWindYear = fromYear.value;
        var maxWindMonth = 1;
        var minWind = 1111111110;
        var minWindYear = fromYear.value;
        var minWindMonth = 1;
        

        dataObjects.forEach(dataObject => {
            const year = parseInt(insertData('"Year"'));
            const month = parseInt(insertData('"Month"'));
            const date = new Date(year,month-1);
            function insertData(name){
                if (dataObject[fieldNames.indexOf(name)].replace(/"/g, '')== '') return null;
                return dataObject[fieldNames.indexOf(name)].replace(/"/g, '');
            }

            
            if(((date-dateStart)>=0&&(dateEnd-date>=0))){
                var tempMaxMeanTemp = parseFloat(insertData('"Mean Max Temp (°C)"'))
                var tempMinMeanTemp = parseFloat(insertData('"Mean Min Temp (°C)"'))
                var tempMaxExtTemp = parseFloat(insertData('"Extr Max Temp (°C)"'))
                var tempMinExtTemp = parseFloat(insertData('"Extr Min Temp (°C)"'))
                var tempRain = parseFloat(insertData('"Total Rain (mm)"'))
                var tempSnow = parseFloat(insertData('"Total Snow (cm)"'))
                var tempWind = parseFloat(insertData('"Spd of Max Gust (km/h)"'))
                if (tempMaxMeanTemp >= maxMeanTemp&&tempMaxMeanTemp!=null) {
                    maxMeanTemp = tempMaxMeanTemp;
                    maxMeanTempYear = year;
                    maxMeanTempMonth = month;
                }
        
                if (tempMinMeanTemp <= minMeanTemp&&tempMinMeanTemp!=null) {
                    minMeanTemp = tempMinMeanTemp;
                    minMeanTempYear = year;
                    minMeanTempMonth = month;
                }
        
                if (tempMaxExtTemp >= maxExtTemp&&tempMaxExtTemp!=null) {
                    maxExtTemp = tempMaxExtTemp;
                    maxExtTempYear = year;
                    maxExtTempMonth = month;
                }
        
                if (tempMinExtTemp <= minExtTemp&&tempMinExtTemp!=null) {
                    minExtTemp = tempMinExtTemp;
                    minExtTempYear = year;
                    minExtTempMonth = month;
                }
        
                if (tempRain >= maxRain&&tempRain!=null) {
                    maxRain = tempRain;
                    maxRainYear = year;
                    maxRainMonth = month;
                }
        
                if (tempRain <= minRain&&tempRain!=null) {
                    minRain = tempRain;
                    minRainYear = year;
                    minRainMonth = month;
                }
        
                if (tempSnow >= maxSnow&&tempSnow!=null) {
                    maxSnow = tempSnow;
                    maxSnowYear = year;
                    maxSnowMonth = month;
                }
        
                if (tempSnow <= minSnow&&tempSnow!=null) {
                    minSnow = tempSnow;
                    minSnowYear = year;
                    minSnowMonth = month;
                }
        
                if (tempWind >= maxWind&&tempWind!=null) {
                    maxWind = tempWind;
                    maxWindYear = year;
                    maxWindMonth = month;
                }
        
                if (tempWind <= minWind&&tempWind!=null) {
                    minWind = tempWind;
                    minWindYear = year;
                    minWindMonth = month;
                }
            }



        });

        const tableBody  = document.createElement('table');
        tableBody.createTHead();
        const header = document.createElement('h1');
        header.textContent = "Données Globales";
        tableDiv.appendChild(header);
        tableDiv.appendChild(tableBody);

        const row = tableBody.insertRow();
        temp=document.createElement("th");
        const typeCell = row.appendChild(temp);      typeCell.textContent = "Donnée";
        temp=document.createElement("th");
        const maxCell = row.appendChild(temp);       maxCell.textContent = "Valeur maximale";
        temp=document.createElement("th");
        const maxYearCell = row.appendChild(temp);   maxYearCell.textContent = "Année";
        temp=document.createElement("th");
        const maxMonthCell = row.appendChild(temp);   maxMonthCell.textContent = "Mois";
        temp=document.createElement("th");
        const minCell= row.appendChild(temp);       minCell.textContent = "Valeur Minimale";
        temp=document.createElement("th");
        const minYearCell = row.appendChild(temp);   minYearCell.textContent = "Année";
        temp=document.createElement("th");
        const minMonthCell = row.appendChild(temp);   minMonthCell.textContent = "Mois";

         //Logic for time check end
        const row1 = tableBody.insertRow();
        const typeCell1 = row1.insertCell();      typeCell1.textContent     = "Température moyenne mensuelle";
        const maxCell1 = row1.insertCell();       maxCell1.textContent      = maxMeanTemp +"ºC " ;
        const maxYearCell1 = row1.insertCell();   maxYearCell1.textContent  = maxMeanTempYear ;
        const maxMonthCell1 = row1.insertCell();   maxMonthCell1.textContent  = maxMeanTempMonth ;
        const minCell1= row1.insertCell();       minCell1.textContent       = (minMeanTemp<10000 ? minMeanTemp:0) + "ºC ";
        const minYearCell1 = row1.insertCell();   minYearCell1.textContent  = minMeanTempYear;
        const minMonthCell1 = row1.insertCell();   minMonthCell1.textContent  = minMeanTempMonth ;

        const row2 = tableBody.insertRow();
        const typeCell2 = row2.insertCell();      typeCell2.textContent      = "Température extrême";
        const maxCell2 = row2.insertCell();       maxCell2.textContent      = maxExtTemp + "ºC ";
        const maxYearCell2 = row2.insertCell();   maxYearCell2.textContent  = maxExtTempYear ;
        const maxMonthCell2 = row2.insertCell();   maxMonthCell2.textContent  = maxExtTempMonth ;
        const minCell2= row2.insertCell();       minCell2.textContent       = (minExtTemp<10000 ? minExtTemp:0) + "ºC ";
        const minYearCell2 = row2.insertCell();   minYearCell2.textContent  = minExtTempYear ;
        const minMonthCell2 = row2.insertCell();   minMonthCell2.textContent  = minExtTempMonth ;

        const row3 = tableBody.insertRow();
        const typeCell3 = row3.insertCell();      typeCell3.textContent     = "Quantitée de pluie";
        const maxCell3 = row3.insertCell();       maxCell3.textContent      = maxRain + "cm ";
        const maxYearCell3 = row3.insertCell();   maxYearCell3.textContent  = maxRainYear ;
        const maxMonthCell3 = row3.insertCell();   maxMonthCell3.textContent  = maxRainMonth ;
        const minCell3= row3.insertCell();        minCell3.textContent      = (minRain<10000 ? minRain:0) + "cm ";
        const minYearCell3 = row3.insertCell();   minYearCell3.textContent  = minRainYear;
        const minMonthCell3 = row3.insertCell();   minMonthCell3.textContent  = minRainMonth ;

        const row4 = tableBody.insertRow();
        const typeCell4 = row4.insertCell();      typeCell4.textContent     = "Quantité de neige";
        const maxCell4 = row4.insertCell();       maxCell4.textContent      = maxSnow + "cm ";
        const maxYearCell4 = row4.insertCell();   maxYearCell4.textContent  = maxSnowYear ;
        const maxMonthCell4 = row4.insertCell();   maxMonthCell4.textContent  = maxSnowMonth ;
        const minCell4= row4.insertCell();       minCell4.textContent       = (minSnow<10000 ? minSnow:0) + "cm ";
        const minYearCell4= row4.insertCell();   minYearCell4.textContent   = minSnowYear ;
        const minMonthCell4= row4.insertCell();   minMonthCell4.textContent   = minSnowMonth ;

        const row5 = tableBody.insertRow();
        const typeCell5 = row5.insertCell();      typeCell5.textContent     = "Vitesse du vent";
        const maxCell5 = row5.insertCell();       maxCell5.textContent      = maxWind + "Km/h";
        const maxYearCell5 = row5.insertCell();   maxYearCell5.textContent  = maxWindYear ;
        const maxMonthCell5 = row5.insertCell();   maxMonthCell5.textContent  = maxWindMonth ;
        const minCell5= row5.insertCell();       minCell5.textContent       = (minWind<10000 ? minWind:0) + "Km/h";
        const minYearCell5 = row5.insertCell();   minYearCell5.textContent  = minWindYear ;
        const minMonthCell5 = row5.insertCell();   minMonthCell5.textContent  = minWindMonth ;

        
    
}

function populateMeteoFeedTable(stationid){
    fetch('/currentWeather?code='+stationid)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Weather data received');
      populateWithXML(data.data)
    } else {
      console.error('Failed to fetch weather data:', data.error);
    }
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });
}
function populateWithXML(xmlData){
    let tableDiv = document.querySelector('.feedData');
    tableDiv.textContent = '';

    const info = document.createElement("div");

    // Parse the XML data
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    // Create a new table
    const table = document.createElement("table");
    table.style.width = '100%';
    table.setAttribute('border', '1');

    // Add table header
    let tr = table.insertRow(-1);
    let headers = ["Prévision", "Sommaire"];
    for(let i = 0; i < headers.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = headers[i];
        tr.appendChild(th);
    }

    // Initialize variables to store the extracted data
    let currentCondition = '';
    let lastUpdatedTime = '';
    let meteoLink = '';
    let veilleAlerte = '';

    // Extract the link to the weather site (assuming the first link is the desired one)
    const links = xmlDoc.getElementsByTagName("link");
    if (links.length > 0) {
        meteoLink = links[0].getAttribute("href");
    }

    // Extract entries for specific details
    const entrie = xmlDoc.getElementsByTagName("entry");
    for (let entry of entrie) {
        const title = entry.getElementsByTagName("title")[0].textContent;
        const updated = entry.getElementsByTagName("updated")[0].textContent;
        const category = entry.getElementsByTagName("category")[0].getAttribute("term");
        
        // Check for current conditions
        if (title.includes("Conditions actuelles")) {
            currentCondition = title + " - " + entry.getElementsByTagName("summary")[0].textContent;
            lastUpdatedTime = updated;
        }
        
        // Check for current watches or warnings
        if (category === "Veilles et avertissements") {
            veilleAlerte = title;
        }
    }

    // Display the extracted data
    
    info.innerHTML = `
    <p><strong>Meteo Site:</strong> <a href="${meteoLink}">${meteoLink}</a></p>
    <p><strong>Last updated:</strong> ${lastUpdatedTime}</p>
    <p><strong>Current Watches or Warnings:</strong> ${veilleAlerte}</p>
    <p><strong>Conditions actuelles:</strong> ${currentCondition}</p>
    `;
    // Iterate through each <entry> in the XML
    const entries = xmlDoc.getElementsByTagName("entry");
    for (let entry of entries) {
        const categories = entry.getElementsByTagName("category");
        let isForecastCategory = false;

        // Check if any of the categories is "Prévisions météo"
        for (let category of categories) {
            if (category.getAttribute("term") === "Prévisions météo") {
                isForecastCategory = true;
                break; // Stop checking categories once "Prévisions météo" is found
            }
        }
        if (!isForecastCategory) continue;

        // The rest of the code remains unchanged, it only executes if the entry has the "Prévisions météo" category
        let row = table.insertRow(-1);
        let title = entry.getElementsByTagName("title")[0].textContent;
        let summary = entry.getElementsByTagName("summary")[0].textContent;

        // Insert new cells (<td>) at the 1st and 2nd position of the "new" <tr> element
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);

        // Add some text to the new cells
        cell1.innerHTML = title;
        cell2.innerHTML = summary;
    }
    tableDiv.appendChild(info);
    tableDiv.appendChild(table);
}