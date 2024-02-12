document.addEventListener("DOMContentLoaded", function () {

    /*Section ajustement des tailles*/

    let tableDataHolder=document.querySelector("#DataView .meteoData");
    tableDataHolder.style.maxHeight=window.innerHeight-tableDataHolder.getBoundingClientRect().y-130+"px";

    let infoHolder = new InfoHolder();
    infoHolder.init();

    let stationsList = document.querySelectorAll(".stationList>li");

    for (let i = 0; i < stationsList.length; i++) {

        stationsList[i].querySelector("span").addEventListener("click", function (e) {
            console.log(e);
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