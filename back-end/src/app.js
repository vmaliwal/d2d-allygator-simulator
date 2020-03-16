const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.json({hello: `world`});
});

/**
 * 
 */
app.post('/vehicles', (req, res) => {
    res.sendStatus(204);
});

app.post('/vehicles/:id/locations', (req, res) => {
    res.sendStatus(204);
});

app.delete('/vehicles/:id', (req, res) => {
    res.sendStatus(204);
})




module.exports = app;