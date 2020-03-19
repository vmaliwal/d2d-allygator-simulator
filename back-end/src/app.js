const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {events: eventNames } = require('./lib/events');
const path = require('path');
const EventService = require('./lib/service/eventService');

const server = require('http').Server(app);
const io = require('./lib/socket').init(server);
const redisAdapter = require('socket.io-redis');

io.adapter(redisAdapter({host: 'redis', port: 6379}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

//TODOS:
// Error handling in paths -- return 404 error
// Try catch for event service emit event

/**
 * 
 */
app.post('/vehicles', async (req, res) => {
    const data = req.body;
    const vehicleId = data.id;

    const payload = {vehicleId, data};

    await EventService.emitEvent(payload, eventNames.VehicleRegistration);

    res.sendStatus(204);
});

app.post('/vehicles/:id/locations', async (req, res) => {
    const vehicleId = req.params.id;
    const data = req.body;
    
    const payload = { vehicleId, data };
    
    await EventService.emitEvent(payload, eventNames.VehicleLocationUpdate);

    res.sendStatus(204);
});

app.delete('/vehicles/:id', async (req, res) => {
    console.log("CALLING TO DELETE VEHICLE ID");

    const vehicleId = req.params.id;
    const data = req.body;

    const payload = {vehicleId, data};

    await EventService.emitEvent(payload, eventNames.VehicleDeregisration);

    res.sendStatus(204);
})

io.on('connection', (socket) => {
    console.log("connected to redis socket");
    socket.emit('hello', "to all clients");
});


module.exports = { app, server }