var latitude = 0, longitude = 0;
var myCenter = new google.maps.LatLng(latitude, longitude);
var username = "bBcpK9Na";
var googleMap;

var markerIcons = {
    me:     { url: "me_emoji.png", scaledSize: new google.maps.Size(40,40) },
    other:  { url: "other_emoji.png", scaledSize: new google.maps.Size(40,40) }
}

function findCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function(curPosition) {
        latitude = curPosition.coords.latitude;
        longitude = curPosition.coords.longitude;
        
        myCenter = new google.maps.LatLng(latitude, longitude);
        googleMap.panTo(myCenter);
        
        addMarker(myCenter, username, "me");
        
        getOtherLocations(latitude, longitude);
    });
}

function loadMap() {
    googleMap = new google.maps.Map(document.getElementById("map"), {
    center: myCenter,
    zoom: 14
    });

    findCurrentLocation();
}

function addMarker(markPos, markTitle, iconType) {
    mark = new google.maps.Marker({
        position: markPos,
        map: googleMap, 
        title: markTitle,
        icon: markerIcons[iconType]
    });
    
    google.maps.event.addListener(mark, "click", function() {
        popup = new google.maps.InfoWindow();
		popup.setContent(markTitle + "'s Location");
		popup.open(map, this);
	});
}

function getOtherLocations(curLat, curLong) {        
        var result, response;
        var request = new XMLHttpRequest();
        
        request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {
                response = JSON.parse(request.responseText);
                showOtherPeople(response.people);
            }
        }
        result = "login=" + username + "&lat=" + curLat + "&lng=" + curLong;
        request.send(result);
}

function showOtherPeople(people) {
    for (person of people) {
        position = new google.maps.LatLng(person.lat, person.lng);
        
        //If my username is returned from datastore, still display my unique icon
        if(person.login == username) {
            addMarker(position, person.login, "me");
        }
        //For other users, display the icon for others
        else {
            addMarker(position, person.login, "other");
        }
    }
}
