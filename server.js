const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

let data = {
    PumpCount: 3,
    Pump1Stat: 3,
    Pump2Stat: 2,
    Pump3Stat: 1,
    Level: 9,
    Flow: 31
};

app.get('/getData', (req, res) => {
    res.status(200).json(data);
});

app.post('/updateData', (req, res) => {
    data = req.body; // Update the data with the request body
    console.log(data.Level + " data"); // Print the updated data to the console

    res.status(200).json({ message: 'Data updated successfully. New Level: ' + data.Level });
});

app.listen(port, () => console.log('Server started on port: ' + port));
