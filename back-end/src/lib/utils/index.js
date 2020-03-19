const Point = require('../model/point');
/**
 *  Refer : http://www.movable-type.co.uk/scripts/latlong.html
 * @param {Point} point1
 * @param {Point} point2 
 */
const distanceBetweenTwoPoints = point1 => point2 => {
    const lat1 = point1.getLat();
    const lat2 = point2.getLat();

    const lng1 = point1.getLng();
    const lng2 = point2.getLng();
    
    const R = 6371e3
    const rLat1 = toRadians(lat1);
    const rLat2 = toRadians(lat2);

    const diffLat = toRadians(lat2 - lat1);
    const diffLng = toRadians(lng2 - lng1);

    const a = Math.sin(diffLat/2) * Math.sin(diffLat/2) +
        Math.cos(rLat1) * Math.cos(rLat2) *
        Math.sin(diffLng/2) * Math.sin(diffLng/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return ((R * c)/1000).toFixed(2);

}

/**
 * 
 * @param {number} val 
 */
function toRadians(val) {
    return val * (Math.PI/180);
}

const D2D_OFFICE_LAT = 52.53;
const D2D_OFFICE_LNG = 13.403;

/**
 * 
 */
const distanceFromD2DOffice = distanceBetweenTwoPoints(new Point(D2D_OFFICE_LAT, D2D_OFFICE_LNG));

/**
 * 
 * @param {number} kms 
 */
const isDistanceGreaterThan = kms => point2 => {
    const distance = distanceFromD2DOffice(point2);
    return distance < kms;
}

/**
 * 
 */
const isPointWithIn3point5FromOffice = isDistanceGreaterThan(3.5);

module.exports = { 
    isPointWithIn3point5FromOffice
}