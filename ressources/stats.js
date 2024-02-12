document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector('.meteoData table tbody');
    let gSH = new GlobalStatHolder(tableBody);
    gSH.init();
 


});

class GlobalStatHolder {


    constructor(tableBody) {
this.tableBody=tableBody

    }

    init() {
       
        for (let i = 0; i < this.tableBody.rows.length; i++) {
            const row = this.tableBody.rows[i];
            
            // Access cells in the current row
            for (let j = 0; j < row.cells.length; j++) {
                const cell = row.cells[j];
                console.log("Row " + (i + 1) + ", Column " + (j + 1) + ": " + cell.textContent);
            }
        }

     //   var donnee = ["Température moyenne mensuelle", "Température extrême", "Quantité de pluie", "Quantité de neige", "Vitesse du vent"];

      //  const matrix = [
       //     [1940, 8, 13.4, 11.8, 17.6, 32.2, 9.4, 9.7, 0],
       //     [1965, 10, 15.6, 8.3, 12, 21.7, 1.1, 99.3, 0]
            
      //  ];
     

      //  var table = document.getElementById("meteoDataMois");


     // this.loadMois(1,donnee,table,matrix);



    }

    loadMois(mois,donnee,table,matrix){


        for (let i = 0; i < donnee.length; i++) {

            var row = table.insertRow();
            var cell = row.insertCell(0);
            let newText = document.createTextNode(donnee[i]);
            cell.appendChild(newText);

            var cell2 = row.insertCell(1);
   
            let newText2 = document.createTextNode(this.findExtremeMois(matrix, 1, 2, -1)[0]);

            cell2.appendChild(newText2);

            var cell3 = row.insertCell(2);
           
            let newText3 = document.createTextNode(this.findExtremeMois(matrix, 1, 2, -1)[1]);
            cell3.appendChild(newText3);

            var cell4 = row.insertCell(3);
        
            let newText4 = document.createTextNode(this.findExtremeMois(matrix, -1, 2, -1)[0]);
            cell4.appendChild(newText4);

            var cell5 = row.insertCell(4);
           
            let newText5 = document.createTextNode(this.findExtremeMois(matrix, -1, 2, -1)[1]);
            cell5.appendChild(newText5);


        }


    }

    findExtremeMois(champs, minMax = 1, pos, mois = -1) {
        // array = champs;
        var extremeValue = champs[0][pos];
        var valueFound = false;
        //champs[0][pos];
        var month = champs[0][1];
        var annee = champs[0][0];
        if (mois > -1) {
            month = mois;
            if (minMax === 1) {
                for (let i = 1; i < champs.length; i++) {

                    if (champs[i][pos] > extremeValue && champs[i][1] === mois) {
                        extremeValue = champs[i][pos];
                        annee = champs[i][0];
                        valueFound = true;

                    }

                }


            } else {
                for (let i = 1; i < champs.length; i++) {
                    if (champs[i][pos] < extremeValue && champs[i][1] === mois) {
                        extremeValue = champs[i][pos];
                        annee = champs[i][0];
                        valueFound = true;
                    }
                }

            }
        } else {


            if (minMax === 1) {
                for (let i = 1; i < champs.length; i++) {

                    if (champs[i][pos] > extremeValue) {
                        extremeValue = champs[i][pos];
                        annee = champs[i][0];
                        valueFound = true;
                        month = champs[i][1];

                    }

                }


            } else {
                for (let i = 1; i < champs.length; i++) {
                    if (champs[i][pos] < extremeValue) {
                        extremeValue = champs[i][pos];
                        annee = champs[i][0];
                        valueFound = true;
                        month = champs[i][1];
                    }
                }

            }



        }


        var resultat = [extremeValue, annee, month, valueFound];
       // console.log(resultat[0] + "  " + resultat[1] + " " + resultat[2] + "  " + resultat[3]);
        return resultat;


    }




}