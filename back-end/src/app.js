const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.json({hello: `world`});
});

app.post('/vehicle')

module.exports = app;