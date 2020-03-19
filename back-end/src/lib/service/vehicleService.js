const Vehicle = require('../schema/Vehicle')
const { isPointWithIn3point5FromOffice } =  require('../utils')

async function findById(vehicleId) {
    return await Vehicle.findOne({ vehicleId });
}

async function save(vehicle) {
    return await vehicle.save()
}

async function upsert(vehicle) {
    const { vehicleId } = vehicle;
    const obj =  await findById(vehicleId);

    if (obj === null || obj === undefined)
        return await save(vehicle);

    obj.isRegistered = vehicle.isRegistered;
    obj.withInBounds = vehicle.withInBounds;

    return await save(obj);

}

function isVehicleWithInBoundries(point) {
    return isPointWithIn3point5FromOffice(point);
}

function getRandomColor() {
    return "#"+((1<<24)*Math.random()|0).toString(16)
}

module.exports = {
    findById,
    save,
    upsert,
    isVehicleWithInBoundries,
    getRandomColor
}