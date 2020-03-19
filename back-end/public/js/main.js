(() => {
    const socket = io({
        transports: ['websocket']
      });
    const MAPBOX_TOKEN = `pk.eyJ1Ijoia29vbmNoaSIsImEiOiJjazd2dDVoeHgxZmNzM2htcjFvc2FsNG45In0.wNsPOe_EaTfaYjVCl0w6Kw`;
    
    socket.on('connect', () => {
        console.log("connection established::");
        
        socket.on('hello', function(msg) {
          console.log("receved mssg::", msg);
        });
    
        socket.on('VehicleRegistration', (data) => {
            registerVehicle(data);
        })
    
        socket.on('VehicleLocationUpdate', (data) => {
            updateVehicleLocation(data);
        });
    
        socket.on('VehicleDeregisration', (data) => {
            removeVehicle(data);
        })
    });
    
    L.mapbox.accessToken = MAPBOX_TOKEN;
    
    const map = L.mapbox.map('map')
    .setView([52.53, 13.403], 13)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    
    const markers = {};
    
    // creates a marker
    function createMarker(lat=52.53, lng=13.403, markerColor, vehicleId) {
        return L.marker([lat, lng], {
            icon: L.mapbox.marker.icon({
                'marker-color': markerColor
            })
        }).bindTooltip(vehicleId);
    };
    
    function setLatLongMarker(marker, lat, lng) {
        marker.setLatLng(L.latLng(lat, lng));
    }
    
    // store vehicle in an object or array
    function registerVehicle({vehicleId, lat=52.53, lng=13.403, markerColor }) {
        const marker = createMarker(lat, lng, markerColor, vehicleId);
        markers[vehicleId] = marker;
        marker.addTo(map);
        return marker;
    }
    
    function updateVehicleLocation({vehicleId, lat, lng, markerColor}) {
        let marker;
        if (vehicleId in markers) {
            marker = markers[vehicleId];
        } else {
            marker = registerVehicle({vehicleId,lat, lng, markerColor});
            markers[vehicleId] = marker;
        }
        setLatLongMarker(marker, lat, lng);
    }
    
    function removeVehicle(vehicleId) {
        if (vehicleId in markers)
        // also remove marker from the map
            delete markers[vehicleId];
    }
    
})()