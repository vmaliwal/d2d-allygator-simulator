// const eventNames = require('./events');
const Vehicle = require('../model/vehicle');

const reduce = async vehicleEvent => {
            
    const vehicle = new Vehicle({ vehicleId: vehicleEvent.vehicleId, isRegistered: true });
    
    await vehicleEvent.save();

    return vehicle;
}

module.exports = async events => {
    let vehicle;

    for (let event of events) {
        vehicle = await reduce(event);
    }

    return vehicle;
}