class Point {
    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }

    getLat() {
        return this.lat;
    }

    getLng() {
        return this.lng;
    }
}

module.exports = Point;