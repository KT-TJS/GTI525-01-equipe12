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
    // allStationsSubList.style.display = 'none'; 
    const toggleSubList = (subList) => {
        // const isDisplayed = subList.style.display === 'block'; // This is buggy
        // subList.style.display = isDisplayed ? 'none' : 'block';
    };

    allStationsSpan.onclick = (event) => {
        event.stopPropagation();
        toggleSubList(allStationsSubList);
    };
    allStationsLi.appendChild(allStationsSubList);
    stationList.appendChild(allStationsLi);
    var sortedObject = {};

    // Get all keys of the original object, sort them alphabetically, 
    // and then iterate over them
    Object.keys(structuredData).sort().forEach(key => {
        // Copy each entry into the new object
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

        provinceSpan.onclick = (event) => {
            event.stopPropagation();
            toggleSubList(stationSubList);
        };
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

//USES GLOBAL STATIONS, add imtemediary function for stats or data. !!!!!!!!!!!!!!!!!!
function loadStationDetails(stationId,name) {
    initPlageDate(stations[stationId]);
    intermediaryFunction(stations[stationId]);
    const infoTitle = document.querySelector('.stationInfoTitle');
    const buttonReset = document.querySelector('.allData');
    infoTitle.textContent = name;
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
function intermediaryFunction(dataList){//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //add logic here
    populateMeteoDataTable(dataList);

    //add your trigger function
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
            if (dataObject[fieldNames.indexOf(name)].replace(/"/g, '')== '') return '-';
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
                if (dataObject[fieldNames.indexOf(name)].replace(/"/g, '')== '') return '-';
                return dataObject[fieldNames.indexOf(name)].replace(/"/g, '');
            }
        });

    }
}
