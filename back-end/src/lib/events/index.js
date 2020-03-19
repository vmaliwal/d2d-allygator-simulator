const VehicleEvent = require('../schema/VehicleEvent');
const events = require('./events');
const saveEvents = require('./reducer');

/**
 * Higher order function for registering vehicles event
 * @param {object} type 
 */
const makeVehicleEvent = type => (data = {}) => {
    const { vehicleId } = data;
    delete data.vehicle;
    
    return new VehicleEvent({ type, vehicleId, payload: data });
}
// Registration events
const AttemtingVehicleRegistration = makeVehicleEvent(events.AttemtingVehicleRegistration);
const VehicleRegistration = makeVehicleEvent(events.VehicleRegistration);

// Location update events
const AttemptingVehicleLocationUpdate = makeVehicleEvent(events.AttemptingVehicleLocationUpdate)
const VehicleLocationUpdate = makeVehicleEvent(events.VehicleLocationUpdate);
const VehicleInBoundries = makeVehicleEvent(events.VehicleInBoundries);
const VehicleNotInBoundries = makeVehicleEvent(events.VehicleNotInBoundries);
const VehicleDisregardLocationUpdate = makeVehicleEvent(events.VehicleDisregardLocationUpdate);

// Deregistration events
const AttemtingVehicleDeregistration = makeVehicleEvent(events.AttemtingVehicleDeregistration);
const VehicleDeregisration = makeVehicleEvent(events.VehicleDeregisration);

module.exports = {
    AttemtingVehicleRegistration,
    VehicleRegistration,
    VehicleLocationUpdate,
    VehicleDeregisration,
    VehicleDisregardLocationUpdate,
    VehicleInBoundries,
    AttemptingVehicleLocationUpdate,
    VehicleNotInBoundries,
    AttemtingVehicleDeregistration,
    events,
    saveEvents
};