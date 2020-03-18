const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vehicle = new Schema({
    vehicleId: String,
    timestamp: {type: Date, default: Date.now},
    isRegistered: {type: Boolean, default: false},
    withInBounds: {type: Boolean, default: true},
    markerColor: String
});

module.exports = mongoose.model("Vehicle", Vehicle);