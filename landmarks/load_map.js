var latitude, longitude;
var googleMap;

function findCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function(curPosition) {
        latitude = curPosition.coords.latitude;
        longitude = curPosition.coords.longitude;
    });
    
    updateMapPosition();
    addMarker(latitude, longitude, "My Location");
}

function loadMap() {
    findCurrentLocation();
    googleMap = new google.maps.Map(document.getElementById("map"), {
        center: {lat: latitude, lng: longitude},
        zoom: 10
    });
}

function updateMapPosition() {
    googleMap.panTo(new google.maps.LatLng(latitude, longitude)); 
}

function addMarker(markLat, markLong, markTitle) {
    new google.maps.Marker({
        position: {lat: markLat, long: markLong},
        map: googleMap, 
        title: markTitle
    });
}

