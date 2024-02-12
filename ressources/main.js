document.addEventListener("DOMContentLoaded", function () {

    let start=0;
    let fin=11;
let startYearDe;
let endYearDe;
let startYearA;
let endYearA;
    //Évènement lancé lorsqu'une station est sélectionnée
    const selectStationCE = new CustomEvent("selectStation", {
        bubbles: true,
        detail: {}
    });
    let infoHolder = new InfoHolder();
    infoHolder.init();

    let stationsList = document.querySelectorAll(".stationList>li");

    for (let i = 0; i < stationsList.length; i++) {

        stationsList[i].querySelector("span").addEventListener("click", function () {
           // document.getElementById("stationInfoTitle").innerHTML =   document.getElementsByClassName("active")[0].children[0].innerText;
            document.querySelectorAll(".active").forEach(function (item) {

                item.classList.remove("active");
                DisplayMonthsStart();
               
                
            });
            stationsList[i].classList.add("active");

        });
        let stationsSubList = stationsList[i].querySelectorAll(".stationSubList>li");

        for (let j = 0; j < stationsSubList.length; j++) {

            stationsSubList[j].addEventListener("selectStation", selectStation);
            stationsSubList[j].addEventListener("click", function () {
                document.getElementById("stationInfoTitle").innerHTML =   stationsSubList[j].innerText;

               

                let activeToRemove = document.querySelectorAll(".active");
                activeToRemove.forEach(function (item) {
                    if (item !== stationsSubList[j]) {
                        item.classList.remove("active");
                    }
                });
                stationsSubList[j].classList.toggle("active");
                stationsList[i].classList.add("active");
                dispatchEvent(selectStationCE);

            });

        }

    }

    function selectStation() {

        //write code for data insertion here

    }
    var select = document.getElementById("stationStartTimeMonth");

    var select2 = document.getElementById("stationEndTimeMonth");
    select.addEventListener("change",function(){


            var selectedMonth= select.optiions[select.selectedIndex];
            start= 4;
            DisplayMonthsStart();
            console.log(start);

    });


    function DisplayMonthsStart(){

            select.innerHTML = "";

          
            select2.innerHTML = "";


            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            for( var i= start; i <= fin; i++){

                    var nouvMois = document.createElement("option");
                    nouvMois.value = i+1;
                    nouvMois.text = months[i];
                    select.appendChild(nouvMois);

                    var nouvMois2 = document.createElement("option");
                nouvMois2.value = i+1;
                nouvMois2.text = months[i];
                select2.appendChild(nouvMois2);

            }




    }

    function DisplayYear(){

        select.innerHTML = "";

      
        select2.innerHTML = "";


        

        for( var i= start; i <= fin; i++){

                var nouvMois = document.createElement("option");
                nouvMois.value = i+1;
                nouvMois.text = months[i];
                select.appendChild(nouvMois);

                var nouvMois2 = document.createElement("option");
            nouvMois2.value = i+1;
            nouvMois2.text = months[i];
            select2.appendChild(nouvMois2);

        }




}


 


});






/*Toggle data-type-area*/

class InfoHolder {

    constructor() {

        this.infoHolderElement = document.querySelector(".infoHolder");
        this.buttonNavList = document.querySelectorAll(".stationDataNavButton");


    }

    changeToView(areaType = "Data") {
        this.infoHolderElement.setAttribute("data-type-area", areaType);
    }

    init() {

        this.buttonNavList.forEach(function (item) {

            item.addEventListener("click", function (e) {
                this.changeToView(e.target.getAttribute("data-type-view"));
            }.bind(this));
        }.bind(this));

    }

}