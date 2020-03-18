const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vehicle = new Schema({
    vehicleId: { type: String, index: true },
    timestamp: {type: Date, default: Date.now},
    isRegistered: {type: Boolean, default: true},
    withInBounds: {type: Boolean, default: true},
    markerColor: String
});

module.exports = mongoose.model("Vehicle", Vehicle);