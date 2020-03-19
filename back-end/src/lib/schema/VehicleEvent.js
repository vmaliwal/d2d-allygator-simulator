const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for VehicleEvent collection
 */
const VehicleEvent = new Schema({
    vehicleId: { type: String, index: true },
    type: String,
    timestamp: {type: Date, default: Date.now},
    payload: {type: Schema.Types.Mixed, default: {}},
});

module.exports = mongoose.model("VehicleEvent", VehicleEvent);