const VehicleEvent = require('./VehicleEvent');
const events = require('./events');

const makeVehicleEvent = type => (data = {}) => {
    const { vehicleId } = data;
    return new VehicleEvent({ type, vehicleId, data });
}

const VehicleRegistration = makeVehicleEvent(events.VehicleDeregisration);
const VehicleDeregisration = makeVehicleEvent(events.VehicleDeregisration);
const VehicleLocationUpdate = makeVehicleEvent(events.VehicleLocationUpdate);

module.exports = {
    VehicleRegistration,
    VehicleLocationUpdate,
    VehicleDeregisration
};