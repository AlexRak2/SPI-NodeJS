// all elements needed
const baseURL = 'https://spi-nodejs.onrender.com/';

var container = document.getElementById("simulation-container");
var waterLevel = document.getElementById("water-level");
var pipeElements = document.getElementsByClassName("pump");
var waterLevelValue = document.getElementById('water-level-number');
var flowValues = document.getElementsByClassName('flow-number');

// temporary sample JSON 
var sampleJson = {
    "PumpCount": 3,
    "Pump1Stat": 3,
    "Pump2Stat": 2,
    "Pump3Stat": 1,
    "Level": 4.2,
    "Flow": 31
};

// Extract the pump count and level from the JSON
var pumpCount = sampleJson.PumpCount;
var level = sampleJson.Level;

// Set the initial water level height based on the level
setWaterLevelHeight(level);
WaterLevelAnimation(level);

createPipe();

// Set the color of each pipe based on the status
setColor(pipeElements[0], sampleJson.Pump1Stat);
setColor(pipeElements[1], sampleJson.Pump2Stat);
setColor(pipeElements[2], sampleJson.Pump3Stat);


//create each pipe dynamically
function createPipe()
{
    var pumpContainer = document.querySelector(".pump-container");
    var pipeContainer = document.querySelector(".pipe-container");
    var pipeTitleContainer = document.querySelector(".bottom-container");


    for (let i = 0; i < pumpCount; i++) {

      var pumpElement = document.createElement("div");
      pumpElement.classList.add("pump");
      pumpContainer.appendChild(pumpElement);

      var pipeElemet = document.createElement("div");
      pipeElemet.classList.add("pipe");
      pipeContainer.appendChild(pipeElemet);

      var pumpTitle = document.createElement("div");
      pumpTitle.classList.add("pipe-title");
      pumpTitle.textContent = 'Pump ' + (i + 1);
      pipeTitleContainer.appendChild(pumpTitle);
    }
}


// set pipe color based on status
function setColor(pumpElement, status) {
    switch (status) {
        case 1:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--running-color');
            break;
        case 2:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--alarm-red-color');
            break;
        case 3:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--alarm-yellow-color');
            break;
    }
}

// set water height
function setWaterLevelHeight(level) {
    var maxHeight = 10; // Maximum water level height in FT
    var containerHeight = container.offsetHeight;
    var waterLevelHeight = (level / maxHeight) * containerHeight;
    waterLevel.style.height = waterLevelHeight + "px";

    updateValues(level);
}

// water animation to simulate fake waves
function WaterLevelAnimation() {
    var minHeight = 0.5; // Minimum water level height in FT
    var maxHeight = 10; // Maximum water level height in FT
    var levelRange = 0.5; // Range around the level value
    var interval = 1000; // Animation interval in milliseconds

    setInterval(function() {
        var randomLevel = level + (Math.random() * levelRange * 2 - levelRange);
        randomLevel = Math.max(minHeight, Math.min(maxHeight, randomLevel)); // Clamp the value within the height range
        setWaterLevelHeight(randomLevel);
    }, interval);
}

//update all number values as visual representation
function updateValues(level)
{
    const roundedValue = level.toFixed(1);
    waterLevelValue.textContent = roundedValue;

    for(let i = 0; i < flowValues.length; i++)
    {
        flowValues[i].textContent = sampleJson.Flow;
    }
}

// Function to fetch data and update UI
async function getInfo() {
    try {
      const res = await fetch(baseURL + 'getData', {
        method: 'GET'
      });
  
      if (res.ok) {
        const resJSON = await res.json(); // Extract JSON content from the response
        dataJson = resJSON;
        updateValues();
      } else {
        console.log('Failed to fetch data');
      }
    } catch (error) {
      console.log('An error occurred while fetching data:', error);
    }
  }
  
  // Refresh data every second
  setInterval(getInfo, 1000);

