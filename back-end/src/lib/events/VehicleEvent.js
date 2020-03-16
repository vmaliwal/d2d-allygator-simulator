const mongoose = require('mongoose');
const Schema = mongoose.Schema

const VehicleEvent = new Schema({
    vehicleId: String,
    type: String,
    timestamp: {type: Date, default: Date.now},
    data: {type: Schema.Types.Mixed, default: {}},
});

module.exports = mongoose.model("VehicleEvent", VehicleEvent);