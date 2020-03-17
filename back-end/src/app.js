const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const E = require('./lib/events');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({hello: `world`});
});

/**
 * 
 */
app.post('/vehicles', async (req, res) => {
    const data = req.body;
    const registrationEvent = E.VehicleRegistration({ vehicleId: data.id, data: data })
    await E.saveEvents([registrationEvent]);

    res.sendStatus(204);
});

app.post('/vehicles/:id/locations', async (req, res) => {
    const vehicleId = req.params.id;
    const data = req.body;
    const locationUpdateEvent = E.VehicleLocationUpdate({ vehicleId: vehicleId, data: data });
    await E.saveEvents([locationUpdateEvent]);
    

    res.sendStatus(204);
});

app.delete('/vehicles/:id', async (req, res) => {
    const vehicleId = req.params.id;
    const data = req.body;
    const vehicleDeregistration = E.VehicleDeregisration({ vehicleId: vehicleId, data: data });
    await E.saveEvents([vehicleDeregistration]);

    res.sendStatus(204);
})




module.exports = app;