document.addEventListener("DOMContentLoaded", function () {

    /*Section ajustement des tailles*/
    let infoHolderElem=document.querySelector(".infoHolder");
    let tableDataHolder=document.querySelector("#DataView .meteoData");
    tableDataHolder.style.maxHeight=window.innerHeight-infoHolderElem.getBoundingClientRect().y-130+"px";
    let tableDataHolder2=document.querySelector("#FeedView .feedData");
    tableDataHolder2.style.maxHeight=window.innerHeight-infoHolderElem.getBoundingClientRect().y-130+"px";
    let tableDataHolder4=document.querySelector("#StatsView .stats");
    tableDataHolder4.style.maxHeight=window.innerHeight-infoHolderElem.getBoundingClientRect().y-130+"px";
    let tableDataHolder5=document.querySelector("#InfoView .dailyInfo");
    tableDataHolder5.style.maxHeight=window.innerHeight-infoHolderElem.getBoundingClientRect().y-130+"px";

    let infoHolder = new InfoHolder();
    infoHolder.init();

    

    let stationsList = document.querySelectorAll(".stationList>li");

    for (let i = 0; i < stationsList.length; i++) {

        stationsList[i].querySelector("span").addEventListener("click", function (e) {
            if(e.target.parentElement.classList.contains("active")&&e.target.parentElement===stationsList[i]){
                stationsList[i].classList.toggle("close");

            }
            else{
            document.querySelectorAll(".active").forEach(function (item) {

                item.classList.remove("active");
                item.classList.remove("close");

            });
            stationsList[i].classList.add("active");

        }});
        let stationsSubList = stationsList[i].querySelectorAll(".stationSubList>li");

        for (let j = 0; j < stationsSubList.length; j++) {


            stationsSubList[j].addEventListener("click", function () {
                let activeToRemove = document.querySelectorAll(".active");
                activeToRemove.forEach(function (item) {
                    if (item !== stationsSubList[j]) {
                        item.classList.remove("active");
                    }
                });
                stationsSubList[j].classList.toggle("active");
                stationsList[i].classList.add("active");

            });

        }

    }

//TODO ajouter le callback pour l'event listener de la section Info journalières ici. À faire pour T2.4
    document.querySelector("#dailyInfoDateSelection").addEventListener("change",async function(){
        const selectedDate = this.value;
        const dateObj = new Date(selectedDate);
        const day = dateObj.getDate()+1;
        const month = dateObj.getMonth()+1;
        const year = dateObj.getFullYear();
        getDailyInfo();
    })

});

function getDailyInfo(){
    var tbody = document.getElementById("weatherData");

    // Clear existing rows
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    var dateElement = document.getElementById("dailyInfoDateSelection");
    const selectedDate = dateElement.value;
    const dateObj = new Date(selectedDate);
    const day = dateObj.getDate()+1;
    const month = dateObj.getMonth()+1;
    const year = dateObj.getFullYear();
    try {
        // Make an AJAX request to your backend
        const queryString = `?stationId=${currentStation}&year=${year}&month=${month}&day=${day}`;
        fetch(`/fetchClimateDay${queryString}`)
        .then(response => {
            // Check if the response is OK
            if (response.status == 500) {
                showError("Pas de météo, choisis une autre date");
                return
            }
            if (!response.ok) {
                throw new Error('La requête a échoué.');
            }
            // Return the response body as text
            return response.text();
        })
        .then(result => {
            dailyInfo(result, day);
        })
        .catch(error => console.error('Error:', error));
    } catch (error) {
        if (error instanceof ReferenceError) {
            // Handle the ReferenceError
            console.error("currentStation is not defined.");
        } else {
            // Handle other types of errors
            console.error("An error occurred:", error);
        }
    }
}

function showError(errorMessage) {
    var tbody = document.getElementById("weatherData");

    // Clear existing rows
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = errorMessage;
  
    // Append error message element to the container
    const errorContainer = document.getElementById('InfoView');
    errorContainer.appendChild(errorElement);
  
    // Remove error message after 5 seconds (5000 milliseconds)
    // setTimeout(() => {
    //   errorElement.remove();
    // }, 5000); // Adjust duration as needed
  }

function dailyInfo(data, day) {

    const parsedData = parseStringIntoArray(data);

    const hourOfDayArray = getDayArrayFromMonthArray(parsedData, day)

    var tbody = document.getElementById("weatherData");

    // Clear existing rows
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (var i = 0; i < 24; i++) {
        var row = document.createElement("tr");
        
        // Créer la cellule de l'heure
        var timeCell = document.createElement("td");
        timeCell.textContent = i + ":00"; // Ajouter l'heure
        row.appendChild(timeCell);
        
        // Ajouter les éléments de hourOfDayArray aux cellules suivantes
        var dataColumns = [9, 10, 11, 13, 17, 19, 23]; // Index des colonnes de hourOfDayArray
        dataColumns.forEach(index => {
            var dataCell = document.createElement("td");
            // Vérifier que l'index est valide et que la valeur est présente
            if (hourOfDayArray[i] && hourOfDayArray[i][index]) {
                var value = parseFloat(hourOfDayArray[i][index].replace(/^"(.*)"$/, '$1'));
                // Vérifier si la valeur est un nombre valide
                if (!isNaN(value)) {
                    dataCell.textContent = value;
                } else {
                    dataCell.textContent = "S/O";
                }
            } else {
                dataCell.textContent = "S/O"; // Valeur par défaut si aucune donnée n'est disponible
            }
            row.appendChild(dataCell);
        });
        
        tbody.appendChild(row);
    }
}

//transforme la reponse de l'api qui est en string en un array utilisable
function parseStringIntoArray(data) {
    if(data == undefined){
        return;
    }
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
    const filteredData = parsedData.filter(row => {
        var timeLSTString;
        if (row[7] != undefined){
            timeLSTString = row[7].replace(/^"(.*)"$/, '$1');
        }
        const timeLST = parseInt(timeLSTString);
        // Check if the parsed value is equal to 7
        return timeLST === day;
    });

    return filteredData;
}

/*Toggle data-type-area*/

class InfoHolder {

    constructor() {

        this.infoHolderElement = document.querySelector(".infoHolder");
        this.buttonNavList = document.querySelectorAll(".stationDataNavButton");
    }

    changeToView(areaType = "Data") {
        this.infoHolderElement.setAttribute("data-type-area", areaType);
        switch (areaType){
            case "Feed":
                document.querySelector("#StationDateSelectionForm").classList.add("StationDateSelectionFormInvisible");
                document.querySelector("#pageDate").classList.add("StationDateSelectionFormInvisible");
                break;
            case "Info":
                document.querySelector("#StationDateSelectionForm").classList.add("StationDateSelectionFormInvisible");
                document.querySelector("#pageDate").classList.add("StationDateSelectionFormInvisible");
                break;
            default:
                document.querySelector("#StationDateSelectionForm").classList.remove("StationDateSelectionFormInvisible");
                document.querySelector("#pageDate").classList.remove("StationDateSelectionFormInvisible");
        }
    }

    init() {

        this.buttonNavList.forEach(function (item) {

            item.addEventListener("click", function (e) {
                this.changeToView(e.target.getAttribute("data-type-view"));
            }.bind(this));
        }.bind(this));

    }

}