const VehicleEvent = require('./VehicleEvent');
const events = require('./events');
const saveEvents = require('./reducer');

const makeVehicleEvent = type => (data = {}) => {
    const { vehicleId } = data;
    delete data.vehicleId;
    
    return new VehicleEvent({ type, vehicleId, data });
}

const VehicleRegistration = makeVehicleEvent(events.VehicleRegistration);
const VehicleDeregisration = makeVehicleEvent(events.VehicleDeregisration);
const VehicleLocationUpdate = makeVehicleEvent(events.VehicleLocationUpdate);

module.exports = {
    VehicleRegistration,
    VehicleLocationUpdate,
    VehicleDeregisration,
    events,
    saveEvents
};