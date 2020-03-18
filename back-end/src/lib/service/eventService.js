const E = require('../events');
const { events: eventNames } = require('../events');
const VehicleService = require('./vehicleService');
const Point = require('../model/point');
const VehicleSchema = require('../schema/Vehicle');

// register GPS
    // vehicle register event
    // vehicle registered in DB

// update location
    // Attempting to update location
    // Found with in boundries
        // Update Location
        // Location Update Event saved
    // Found outside of boundries
        // Update Location Disregard event
        // Location update disregard event saved

// Deregister location
    // Deregister event
    // vehicle deregistration event

async function emitEvent (payload, event) {
    const { vehicle: vehicleModel, data } = payload; 
    const vehicleId = vehicleModel.getVehicleId();
    const io = require('../utils/socket').getIo();

    switch(event) {
        case eventNames.VehicleRegistration: {
            const markerColor = VehicleService.getRandomColor();

            const vehicleSchema = new VehicleSchema({ vehicleId, isRegistered: true, withinBoundries: true, markerColor });

            const attemptRegistrationEvent = E.AttemtingVehicleRegistration(payload);
            const savedVehicle = await VehicleService.upsert(vehicleSchema);

            const registrationEvent = E.VehicleRegistration(payload);

            await E.saveEvents([attemptRegistrationEvent, registrationEvent]);

            const vehiclePayload = {
                vehicleId: savedVehicle.vehicleId,
                markerColor: savedVehicle.markerColor
            }
            
            io.emit(event, vehiclePayload);

            break;
        }
        
        case eventNames.VehicleLocationUpdate: {
            const savedVehicle = await VehicleService.findById(vehicleId);
            const events = [];

            const attemptVehicleLocationUpdateEvent = E.AttemptingVehicleLocationUpdate(payload);

            events.push(attemptVehicleLocationUpdateEvent);

            const { lat, lng } = data;
            const point = new Point(lat, lng);
    
            const withinBoundries = VehicleService.isVehicleWithInBoundries(point);

            if (!withinBoundries) {
                const vehicleNotInBoundriesEvent = E.VehicleNotInBoundries(payload);
                events.push(vehicleNotInBoundriesEvent);
                
                const vehicleSchema = new VehicleSchema({ vehicleId, withinBoundries: false, markerColor });

                await VehicleService.upsert(vehicleSchema);

                const vehicleDisregardLocationUpdateEvent = E.VehicleDisregardLocationUpdate(payload);
                events.push(vehicleDisregardLocationUpdateEvent);

                await E.saveEvents(events);

                break;
            }


            const vehicleInBoundriesEvent = E.VehicleInBoundries(payload);
            events.push(vehicleInBoundriesEvent);

            const vehicleLocationUpdateEvent = E.VehicleLocationUpdate(payload);
            events.push(vehicleLocationUpdateEvent);
            await E.saveEvents(events);

            const vehiclePayload = {
                vehicleId: savedVehicle.vehicleId,
                lat,
                lng,
                markerColor: savedVehicle.markerColor
            }

            io.emit(event, vehiclePayload);

            break;
        }
        
        case eventNames.VehicleDeregisration: {

        }
        
        default:
            throw new Error("Unknown event emitted");
    }


}

module.exports = {
    emitEvent
}