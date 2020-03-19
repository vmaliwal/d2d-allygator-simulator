/**
 * Save event to event collection
 */
module.exports = async vehicleEvents => {
    let vehicle;
    const events = [];

    for (let event of vehicleEvents) {
        vehicle = await event.save();
        events.push(vehicle);
    }

    return events;
}