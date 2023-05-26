const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/getData', (req, res) => {
    res.status(200).json(data);
});

app.post('/updateData', (req, res) => {
    console.log(req.body + " data"); // Print the updated data to the console

    res.status(200).json({ message: 'Data updated successfully. New Level: ' + req.body.Level });
});

app.listen(port, () => console.log('Server started on port: ' + port));
