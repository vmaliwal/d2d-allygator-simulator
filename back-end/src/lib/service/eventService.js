const E = require('../events');
const { events: eventNames } = require('../events');
const VehicleService = require('./vehicleService');
const Point = require('../model/point');
const VehicleSchema = require('../schema/Vehicle');

async function emitEvent (payload, event) {
    const { vehicleId } = payload;

    const io = require('../socket').getIo();

    switch(event) {
        case eventNames.VehicleRegistration: {
            return registerVehicle(payload);
        }
        
        case eventNames.VehicleLocationUpdate: {
            return updateVehicle(payload);
        }
        
        case eventNames.VehicleDeregisration: {
            return deRegisterVehicle(payload);
        }
        
        default:
            throw new Error("Unknown event emitted");
    }


    async function registerVehicle(payload) {
        const markerColor = VehicleService.getRandomColor();

        const vehicleSchema = new VehicleSchema({ vehicleId, isRegistered: true, withInBounds: true, markerColor });

        const attemptRegistrationEvent = E.AttemtingVehicleRegistration(payload);
        const savedVehicle = await VehicleService.upsert(vehicleSchema);

        const registrationEvent = E.VehicleRegistration(payload);

        const savedEvents = await E.saveEvents([attemptRegistrationEvent, registrationEvent]);

        const vehiclePayload = {
            vehicleId: savedVehicle.vehicleId,
            markerColor: savedVehicle.markerColor
        }
        
        io.emit(event, vehiclePayload);

        return savedEvents;
    }

    async function updateVehicle(payload) {

        const savedVehicle = await VehicleService.findById(vehicleId);
        const events = [];

        const attemptVehicleLocationUpdateEvent = E.AttemptingVehicleLocationUpdate(payload);

        events.push(attemptVehicleLocationUpdateEvent);

        const { lat, lng } = payload.data;
        const point = new Point(lat, lng);
        
        const withinBoundries = VehicleService.isVehicleWithInBoundries(point);

        if (!withinBoundries) {
            const vehicleNotInBoundriesEvent = E.VehicleNotInBoundries(payload);
            events.push(vehicleNotInBoundriesEvent);
            
            const vehicleSchema = new VehicleSchema({ vehicleId, withInBounds: false, markerColor: savedVehicle.markerColor });
            await VehicleService.upsert(vehicleSchema);

            const vehicleDisregardLocationUpdateEvent = E.VehicleDisregardLocationUpdate(payload);
            events.push(vehicleDisregardLocationUpdateEvent);

            return await E.saveEvents(events);
        }

        const vehicleInBoundriesEvent = E.VehicleInBoundries(payload);
        events.push(vehicleInBoundriesEvent);

        const vehicleLocationUpdateEvent = E.VehicleLocationUpdate(payload);
        events.push(vehicleLocationUpdateEvent);
        const savedEvents = await E.saveEvents(events);

        const vehiclePayload = {
            vehicleId: savedVehicle.vehicleId,
            lat,
            lng,
            markerColor: savedVehicle.markerColor
        }

        io.emit(event, vehiclePayload);

        return savedEvents;

    }

    async function deRegisterVehicle(payload) {
        const savedVehicle = await VehicleService.findById(vehicleId);

        const attemptingVehicleDeregisrationEvent = E.AttemtingVehicleDeregistration(payload);

        const vehicleSchema = new VehicleSchema({ vehicleId, isRegistered: false });

        await VehicleService.upsert(vehicleSchema);

        const vehicleDeregisrationEvent = E.VehicleDeregisration(payload);

        const savedEvents = await E.saveEvents([attemptingVehicleDeregisrationEvent, vehicleDeregisrationEvent]);

        const vehiclePayload = {
            vehicleId: savedVehicle.vehicleId,
            markerColor: savedVehicle.markerColor
        }

        io.emit(event, vehiclePayload);

        return savedEvents;
    }

}

module.exports = {
    emitEvent
}