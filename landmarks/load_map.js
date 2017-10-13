
var latitude, longitude;
var googleMap;
var username = "bBcpK9Na";

function findCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function(curPosition) {
        latitude = curPosition.coords.latitude;
        longitude = curPosition.coords.longitude;
    });
    
    //updateMapPosition();
    //addMarker(latitude, longitude, "My Location");
}

function loadMap() {
    findCurrentLocation();
    googleMap = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 10
    });
}

function updateMapPosition() {
    googleMap.panTo(new google.maps.LatLng(latitude, longitude)); 
}

function addMarker(markLat, markLong, markTitle) {
    marker = new google.maps.Marker({
        position: {lat: markLat, long: markLong},
        map: googleMap, 
        title: markTitle
    });
}

