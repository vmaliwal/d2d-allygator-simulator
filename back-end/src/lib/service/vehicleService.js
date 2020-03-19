const Vehicle = require('../schema/Vehicle')
const { isPointWithIn3point5FromOffice } =  require('../utils')

/**
 * Finds single document from Vehicle collection
 * @param {string} vehicleId 
 */
async function findById(vehicleId) {
    return await Vehicle.findOne({ vehicleId });
}

/**
 * save vehicle document to Vehicle collection
 * @param {Vehicle} vehicle 
 */
async function save(vehicle) {
    return await vehicle.save()
}

/**
 * Update existing or insert a new document in Vehicle collection
 * @param {Vehicle} vehicle 
 */
async function upsert(vehicle) {
    const { vehicleId } = vehicle;
    const obj =  await findById(vehicleId);

    if (obj === null || obj === undefined)
        return await save(vehicle);

    obj.isRegistered = vehicle.isRegistered;
    obj.withInBounds = vehicle.withInBounds;

    return await save(obj);

}

/**
 * Returns boolean value if vehicle is within boundry
 * @param {Point} point 
 * @returns Boolean
 */
function isVehicleWithInBoundries(point) {
    return isPointWithIn3point5FromOffice(point);
}

/**
 * Returns a random hex color
 */
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