const VehicleEvent = require('../schema/VehicleEvent');
const events = require('./events');
const saveEvents = require('./reducer');

const makeVehicleEvent = type => (data = {}) => {
    const { vehicleId } = data;
    delete data.vehicleId;
    
    return new VehicleEvent({ type, vehicleId, data });
}
const AttemtingVehicleRegistration = makeVehicleEvent(events.AttemtingVehicleRegistration);
const VehicleRegistration = makeVehicleEvent(events.VehicleRegistration);

const AttemptingVehicleLocationUpdate = makeVehicleEvent(events.AttemptingVehicleLocationUpdate)
const VehicleLocationUpdate = makeVehicleEvent(events.VehicleLocationUpdate);
const VehicleInBoundries = makeVehicleEvent(events.VehicleInBoundries);
const VehicleNotInBoundries = makeVehicleEvent(events.VehicleNotInBoundries);
const VehicleDisregardLocationUpdate = makeVehicleEvent(events.VehicleDisregardLocationUpdate);

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