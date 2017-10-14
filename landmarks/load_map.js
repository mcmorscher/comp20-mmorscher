var latitude = 0, longitude = 0;
var myCenter = new google.maps.LatLng(latitude, longitude);
var username = "bBcpK9Na";
var googleMap;

function findCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function(curPosition) {
        latitude = curPosition.coords.latitude;
        longitude = curPosition.coords.longitude;
        
        myCenter = new google.maps.LatLng(latitude, longitude);
        googleMap.panTo(myCenter);
        
        addMarker(myCenter, username);
    });
}

function loadMap() {
    googleMap = new google.maps.Map(document.getElementById("map"), {
    center: myCenter,
    zoom: 12
    });

    findCurrentLocation();
}

function addMarker(markPos, markTitle) {
    mark = new google.maps.Marker({
        position: markPos,
        map: googleMap, 
        title: markTitle
    });
    
    google.maps.event.addListener(mark, "click", function() {
        popup = new google.maps.InfoWindow();
		popup.setContent(markTitle + "'s Location");
		popup.open(map, mark);
	});
}

