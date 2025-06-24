// script.js
const SHEET_ID = "172Uxq75bJg_c97_MurIVnraP12dPzpXzZN5Xr8WnaGw";
const SHEET_NAME = "Hoja1"; // Corrected based on user feedback

async function searchCoffee() {
  const coffeeName = document.getElementById("coffeeName").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  const loaderDiv = document.getElementById("loader");

  resultsDiv.innerHTML = ""; // Clear previous results
  loaderDiv.style.display = "block"; // Show loader

  try {
    const data = await getSheetData();
    const coffeeInfo = findCoffeeInfo(coffeeName, data);

    if (coffeeInfo) {
      resultsDiv.innerHTML = `<p><b>Origin:</b> ${coffeeInfo.origin}</p><p><b>Flavor:</b> ${coffeeInfo.flavor}</p>`;
    } else {
      resultsDiv.innerHTML = "<p>Coffee not found.</p>";
    }
  } catch (error) {
    console.error("Error searching for coffee:", error);
    resultsDiv.innerHTML = "<p>Error searching for coffee. Please try again later.</p>";
  } finally {
    loaderDiv.style.display = "none"; // Hide loader regardless of outcome
  }
}

async function getSheetData() {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching sheet data: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

function findCoffeeInfo(coffeeName, data) {
  // Ensure data is an array before trying to iterate
  if (!Array.isArray(data)) {
    console.error("Data received from sheet is not an array:", data);
    return null;
  }
  for (const row of data) {
    // Assuming column names in the sheet are 'cafe', 'origen', and 'sabor'.
    // It's good practice to ensure these properties exist and are strings before calling toLowerCase.
    if (row.cafe && typeof row.cafe === 'string' && row.cafe.toLowerCase() === coffeeName) {
      return {
        origin: row.origen || "Information not available",
        flavor: row.sabor || "Information not available"
      };
    }
  }
  return null;
}