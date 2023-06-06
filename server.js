const express = require('express');
const app = express();
const port = 3000;

const mqtt = require('mqtt');
const brokerUrl = 'ws://test.mosquitto.org:8080';
const client = mqtt.connect(brokerUrl);
const topic = 'alex/x'; 

app.use(express.static('public'));
app.use(express.json());

let data = {
    PumpCount: 3,
    Pump1Stat: 3,
    Pump2Stat: 2,
    Pump3Stat: 1,
    Level: 4.2,
    Flow: 31
};

client.on('connect', () => {
  console.log('Connected to the MQTT broker');
});

client.subscribe(topic, (err) => {
  if (err) {
    console.error('Error subscribing to topic:', err);
  } else {
    console.log('Subscribed to topic:', topic);
    // Additional logic to handle subscribed topic
  }
});

client.on('error', (error) => {
    console.error('Error connecting to MQTT broker:', error);
});

client.on('message', (topic, message) => {
    console.log('Received message from topic:', topic);
    console.log('Message:', message.toString());
    
    // Parse the received JSON message
    const receivedData = JSON.parse(message.toString());
    data = receivedData;
    console.log(data);
});

app.get('/getData', (req, res) => {
    res.status(200).json(data);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
