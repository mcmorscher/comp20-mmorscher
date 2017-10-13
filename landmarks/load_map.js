var latitude, longitude;
var googleMap;

function findCurrentLocation() {
    
}

function loadMap() {
    findCurrentLocation();
    googleMap = new google.maps.Map(document.getElementById("map"), {
        center: {lat: latitude, lng: longitude},
        zoom: 10
    });
}

