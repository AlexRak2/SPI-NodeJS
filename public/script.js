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

var dataJson = {
    "PumpCount": 3,
    "Pump1Stat": 3,
    "Pump2Stat": 2,
    "Pump3Stat": 1,
    "Level": 4.2,
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

    const roundedValue = dataJson.Level.toFixed(1);
    waterLevelValue.textContent = roundedValue;

    for (let i = 0; i < flowValues.length; i++) {
        flowValues[i].textContent = dataJson.Flow;
    }

    createPipe();

    // probably better if pump stat was an array so it can be more dynamic but the webstie itself can only contain 3 pipes
    for(var i = 0; i < PumpCount; i++)
    {
        setColor(pipeElements[0], dataJson.Pump1Stat);
        switch(i)
        {
            case 1:
                setColor(pipeElements[1], dataJson.Pump1Stat);
                break;
            case 2:
                setColor(pipeElements[2], dataJson.Pump2Stat);
                break;
            case 3:
                setColor(pipeElements[3], dataJson.Pump3Stat);
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

// Set water height
function setWaterLevelHeight(level) {
    const maxHeight = 10; // Maximum water level height in FT
    const containerHeight = container.offsetHeight;
    let waterLevelHeight = (level / maxHeight) * containerHeight;
  
    // Clamp waterLevelHeight between 0 and containerHeight
    waterLevelHeight = Math.max(0, Math.min(containerHeight, waterLevelHeight));
  
    waterLevel.style.height = waterLevelHeight + "px";
}

// Water animation to simulate fake waves
function waterLevelAnimation() {
    const minHeight = 0.5; // Minimum water level height in FT
    const maxHeight = 10; // Maximum water level height in FT
    const levelRange = 0.5; // Range around the level value
    const interval = 1000; // Animation interval in milliseconds

    setInterval(() => {
        const randomLevel = dataJson.Level + (Math.random() * levelRange * 2 - levelRange);
        const clampedLevel = Math.max(minHeight, Math.min(maxHeight, randomLevel)); // Clamp the value within the height range
        setWaterLevelHeight(clampedLevel);
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

