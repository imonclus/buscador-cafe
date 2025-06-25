// script.js
const SHEET_ID = "172Uxq75bJg_c97_MurIVnraP12dPzpXzZN5Xr8WnaGw";
const SHEET_NAME = "Hoja1";

// --- SE EJECUTA CUANDO LA PÁGINA HA CARGADO ---
document.addEventListener('DOMContentLoaded', function() {
  displayCoffeeList();
  // --- LÓGICA PARA EL BOTÓN DE MÚSICA ---
  const audioFondo = document.getElementById('audio-fondo');
  const playPauseBtn = document.getElementById('play-pause-btn');

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
      if (audioFondo.paused) {
        audioFondo.play();
        playPauseBtn.textContent = 'Pausar Música';
      } else {
        audioFondo.pause();
        playPauseBtn.textContent = 'Reproducir Música';
      }
    });
  }
    // --- LÓGICA PARA LA LISTA DESPLEGABLE ---
  const coffeeListToggle = document.getElementById('coffee-list-toggle');
  const coffeeList = document.getElementById('coffee-list');

  if (coffeeListToggle) {
    coffeeListToggle.addEventListener('click', function() {
      // Añade o quita la clase 'open' de la lista <ul>
      coffeeList.classList.toggle('open');
      // Añade o quita la clase 'active' del título <h2> para rotar la flecha
      this.classList.toggle('active');
    });
  }
  // --- FIN DE LA LÓGICA DESPLEGABLE ---
});

/**
 * Capitaliza la primera letra de un string.
 * @param {string} string El string a capitalizar.
 * @returns {string} El string con la primera letra en mayúscula.
 */
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Obtiene los datos de la hoja de cálculo y muestra la lista de cafés disponibles.
 */
function displayCoffeeList() {
  const listElement = document.getElementById('coffee-list');
  const audioClick = document.getElementById('audio-click'); // <-- 1. OBTÉN EL SONIDO

  getSheetData()
    .then(function(data) {
      listElement.innerHTML = ''; 

      data.forEach(function(row) {
        if (row.cafe) {
          const listItem = document.createElement('li');
          listItem.textContent = row.cafe;
          listItem.addEventListener('click', function() {
            audioClick.play(); // <-- 2. REPRODUCE EL SONIDO
            document.getElementById('cafeName').value = row.cafe;
            buscarCafe();
          });
          listElement.appendChild(listItem);
        }
      });
    })
    .catch(function(error) {
      console.error("Error al cargar la lista de cafés:", error);
      listElement.innerHTML = '<li class="list-error">No se pudo cargar la lista.</li>';
    });
}
function buscarCafe() {
  const cafe = document.getElementById("cafeName").value.trim().toLowerCase();
  const resultadoDiv = document.getElementById("resultado");

  resultadoDiv.innerHTML = `<p class="status-message">Buscando...</p>`;

  if (!cafe) {
    resultadoDiv.innerHTML = "";
    return;
  }

  getSheetData()
    .then(function(data) {
      const coffeeInfo = findCoffeeInfo(cafe, data);

      if (coffeeInfo) {
        let detailsHtml = '';
        for (const key in coffeeInfo) {
          if (key !== 'cafe' && coffeeInfo[key]) {
            detailsHtml += `<p><b>${capitalizeFirstLetter(key)}:</b> ${coffeeInfo[key]}</p>`;
          }
        }
        
        resultadoDiv.innerHTML = `
          <div class="result-card">
            <h3>${coffeeInfo.cafe}</h3>
            <div class="result-details">
              ${detailsHtml}
            </div>
          </div>`;
      } else {
        resultadoDiv.innerHTML = `<p class="status-message">Café no encontrado.</p>`;
      }
    })
    .catch(function(error) {
      console.error("Error al buscar:", error);
      resultadoDiv.innerHTML = `<p class="status-message">Error al buscar el café.</p>`;
    });
}

function getSheetData() {
  return new Promise(function(resolve, reject) {
    const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
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
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row.cafe && row.cafe.toLowerCase() === cafeName) {
      return row; 
    }
  }
  return null;
}