// All elements needed
const baseURL = 'https://spi-nodejs.onrender.com/';

const container = document.getElementById("simulation-container");
const waterLevel = document.getElementById("water-level");
const pipeElements = document.getElementsByClassName("pump");
const waterLevelValue = document.getElementById('water-level-number');
const flowValues = document.getElementsByClassName('flow-number');
const pumpContainer = document.querySelector(".pump-container");
const pipeContainer = document.querySelector(".pipe-container");
const pipeTitleContainer = document.querySelector(".bottom-container");

var previousWaterLevel = 0;
var previousPumpCount = 0;

const minWater = 0;
const maxWater = 10;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

var dataJson = {
    "PumpCount": 3,
    "Pump1Stat": 3,
    "Pump2Stat": 2,
    "Pump3Stat": 1,
    "Level": 10,
    "Flow": 31
};



updateValues();
waterLevelAnimation();


// Create each pipe dynamically
function createPipe() {

    //do not delete or create if value was not changed
    if(previousPumpCount == dataJson.PumpCount) return;

    previousPumpCount = dataJson.PumpCount;
    deletePipes();

    for (let i = 0; i < dataJson.PumpCount; i++) {
        const pumpElement = document.createElement("div");
        pumpElement.classList.add("pump");
        pumpContainer.appendChild(pumpElement);

        const pipeElemet = document.createElement("div");
        pipeElemet.classList.add("pipe");
        pipeContainer.appendChild(pipeElemet);

        const pumpTitle = document.createElement("div");
        pumpTitle.classList.add("pipe-title");
        pumpTitle.textContent = 'Pump ' + (i + 1);
        pipeTitleContainer.appendChild(pumpTitle);
    }
}

function deletePipes()
{
    while (pumpContainer.firstChild) {
        pumpContainer.removeChild(pumpContainer.firstChild);
      }
    
      // Remove existing pipe elements
      while (pipeContainer.firstChild) {
        pipeContainer.removeChild(pipeContainer.firstChild);
      }
    
      // Remove existing pump title elements
      while (pipeTitleContainer.firstChild) {
        pipeTitleContainer.removeChild(pipeTitleContainer.firstChild);
      }
}

// Update all number values as visual representation
function updateValues() {


    for (let i = 0; i < flowValues.length; i++) {
        flowValues[i].textContent = dataJson.Flow;
    }

    createPipe();

    // probably better if pump stat was an array so it can be more dynamic but the webstie itself can only contain 3 pipes
    for(var i = 0; i < dataJson.PumpCount; i++)
    {
        switch(i)
        {
            case 0:
                setColor(pipeElements[i], dataJson.Pump1Stat);
                break;
            case 1:
                setColor(pipeElements[i], dataJson.Pump2Stat);
                break;
            case 2:
                setColor(pipeElements[i], dataJson.Pump3Stat);
                break;
        }
    }


    if(dataJson.Level != previousWaterLevel)
    {
        setWaterLevelHeight(dataJson.Level);        
        previousWaterLevel = dataJson.Level;
    }
}

// Set pipe color based on status
function setColor(pumpElement, status) {
    switch (status) {
        case 0:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--running-color');
            break;
        case 1:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--alarm-red-color');
            break;
        case 2:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--alarm-yellow-color');
            break;
    }
}

function setWaterLevelHeight(level) {

    const containerHeight = container.offsetHeight;
    const waterLevelHeight = (level / maxWater) * containerHeight;
  
    const clampedHeight =  Math.max(0, Math.min(containerHeight, waterLevelHeight) - (level < 9 ? 0 : 30));
    waterLevel.style.height = clampedHeight + "px";

    const levelValue = clamp(dataJson.Level, minWater, maxWater);
    const roundedValue = levelValue.toFixed(1);
    waterLevelValue.textContent = roundedValue;
  }

// Water animation to simulate fake waves
function waterLevelAnimation() {
    const levelRange = 0.15; // Range around the level value
    const interval = 500; // Animation interval in milliseconds

    setInterval(() => {
        const randomLevel = dataJson.Level + (Math.random() * levelRange * 2 - levelRange);
        setWaterLevelHeight(randomLevel);
    }, interval);
}


async function getInfo() {
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
}

setInterval(getInfo, 3000);

