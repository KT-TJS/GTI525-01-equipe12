document.addEventListener("DOMContentLoaded",function(){

    let stationsList=document.querySelectorAll(".stationList>li");
    console.log(stationsList);

    for(let i=0;i<stationsList.length;i++){

        stationsList[i].addEventListener("mouseenter",function(){

           stationsList[i].classList.add("open");

        });

        stationsList[i].addEventListener("mouseout",function(){

            stationsList[i].classList.remove("open");

        });

    }
});