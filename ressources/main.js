document.addEventListener("DOMContentLoaded", function () {

    /*Section ajustement des tailles*/

    let tableDataHolder=document.querySelector("#DataView .meteoData");
    tableDataHolder.style.maxHeight=window.innerHeight-tableDataHolder.getBoundingClientRect().y-130+"px";
    let tableDataHolder2=document.querySelector("#StatsView .meteoDataStat");
    tableDataHolder2.style.maxHeight=window.innerHeight-tableDataHolder.getBoundingClientRect().y-130+"px";
    let tableDataHolder3=document.querySelector("#StatsView .meteoDataStatGlob");
    tableDataHolder3.style.maxHeight=window.innerHeight-tableDataHolder.getBoundingClientRect().y-130+"px";
    let tableDataHolder4=document.querySelector("#StatsView .stats");
    tableDataHolder4.style.maxHeight=window.innerHeight-tableDataHolder.getBoundingClientRect().y-100+"px";

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

    // pour générer les 24heures de la journée dans dailyInfo
     var tbody = document.getElementById("weatherData");
     for (var i = 0; i < 24; i++) {
         var row = document.createElement("tr");
         var timeCell = document.createElement("td");
         timeCell.textContent = i + ":00"; // Ajouter l'heure
         row.appendChild(timeCell);
         tbody.appendChild(row);
     }


//TODO ajouter le callback pour l'event listener de la section Info journalières ici. À faire pour T2.4
    document.querySelector("#dailyInfoDateSelection").addEventListener("change",async function(){
        const selectedDate = this.value;
        const dateObj = new Date(selectedDate);
        console.log(selectedDate);
        console.log(dateObj.getMonth());
        const day = dateObj.getDate()+1
        const month = dateObj.getMonth()+1
        const year = dateObj.getFullYear()
        var data = null;
        try {
            // Your code that references currentStation
            console.log(currentStation)
            // Make an AJAX request to your backend
            const queryString = `?stationId=${currentStation}&year=${year}&month=${month}&day=${day}`;
            fetch(`/fetchClimateDay${queryString}`)
            .then(response => {
                // Vérifiez si la réponse est OK
                if (!response.ok) {
                    throw new Error('La requête a échoué.');
                }
                // Retournez le contenu de la réponse en tant que texte
                return response.text();
            })
            .then(result => {
                data = result;
                console.log("result : " + result);
            })
            .catch(error => console.error('Error:', error));
            console.log(data);
        } catch (error) {
            if (error instanceof ReferenceError) {
                // Handle the ReferenceError
                console.error("currentStation is not defined.");
            } else {
                // Handle other types of errors
                console.error("An error occurred:", error);
            }
        }
    })

});





/*Toggle data-type-area*/

class InfoHolder {

    constructor() {

        this.infoHolderElement = document.querySelector(".infoHolder");
        this.buttonNavList = document.querySelectorAll(".stationDataNavButton");
    }

    changeToView(areaType = "Data") {
        this.infoHolderElement.setAttribute("data-type-area", areaType);
        switch (areaType){
            case "Info":
                document.querySelector("#StationDateSelectionForm").classList.add("StationDateSelectionFormInvisible");
                break;
            default:
                document.querySelector("#StationDateSelectionForm").classList.remove("StationDateSelectionFormInvisible");
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