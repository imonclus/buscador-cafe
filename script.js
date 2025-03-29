// script.js
const SHEET_ID = "172Uxq75bJg_c97_MurIVnraP12dPzpXzZN5Xr8WnaGw";
const SHEET_NAME = "Hoja1";

function buscarCafe() {
  var cafe = document.getElementById("cafeName").value.trim().toLowerCase();
  var resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "<p>Buscando...</p>";

  getSheetData()
    .then(function(data) {
      var coffeeInfo = findCoffeeInfo(cafe, data);

      if (coffeeInfo) {
        resultadoDiv.innerHTML = "<p><b>Origen:</b> " + coffeeInfo.origen + "</p><p><b>Sabor:</b> " + coffeeInfo.sabor + "</p>";
      } else {
        resultadoDiv.innerHTML = "<p>Cafe no encontrado.</p>";
      }
    })
    .catch(function(error) {
      console.error("Error al buscar:", error);
      resultadoDiv.innerHTML = "<p>Error al buscar el cafe.</p>";
    });
}

function getSheetData() {
  return new Promise(function(resolve, reject) {
    var url = "https://opensheet.elk.sh/" + SHEET_ID + "/" + SHEET_NAME;
    fetch(url)
      .then(function(response) {
        if (!response.ok) {
          reject("Error al obtener datos: " + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        resolve(data);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

function findCoffeeInfo(cafeName, data) {
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (row.cafe && row.cafe.toLowerCase() === cafeName) {
      return {
        origen: row.origen || "Informacion no disponible",
        sabor: row.sabor || "Informacion no disponible"
      };
    }
  }
  return null;
}