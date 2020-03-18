const Point = require('./point');

class Vehicle {
    constructor({vehicleId, isRegistered=false, lat, lng}) {
        this.vehicleId = vehicleId;
        this.point = new Point(lat, lng);
        this.isRegistered = isRegistered;
        this.markerColor = null;
    }

    setPoint(point) {
        this.point = point;
    }

    getPoint() {
        return this.point;
    } 

    getVehicleId() {
        return this.vehicleId;
    }

    getIsRegistered() {
        return this.isRegistered
    }

    setIsRegistered(isRegistered) {
        this.isRegistered = isRegistered;
    }

    setMarkerColor(color) {
        this.markerColor = color;
    }

    getMarkerColor() {
        return this.markerColor;
    }

}

module.exports = Vehicle;