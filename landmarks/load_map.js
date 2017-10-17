var latitude = 0, longitude = 0;
var currentDistance = 0;
var myCenter = new google.maps.LatLng(latitude, longitude);
var username = "bBcpK9Na";
var googleMap;

var markerIcons = {
    me:      { url: "me_emoji.png", scaledSize: new google.maps.Size(40,40) },
    other:   { url: "other_emoji.png", scaledSize: new google.maps.Size(40,40) },
    landmark:{ url: "landmark.png", scaledSize: new google.maps.Size(40,40) } 
}

function findCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function(curPosition) {
        /* TODO: remove hard-coded location */
        /* Note: My IP address maps to Everett, MA for some reason, which shows no landmarks.*/
        latitude =  /*curPosition.coords.latitude*/   42.40606509140626;
        longitude = /*curPosition.coords.longitude*/ -71.12196830120284;
        
        myCenter = new google.maps.LatLng(latitude, longitude);
        googleMap.panTo(myCenter);
        
        addMarker(myCenter, username + "'s Location", "me");
        
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
        calculateDistanceTo(mark.position);
		popup.setContent(markTitle + " is " + currentDistance + "miles away!");
		popup.open(map, this);
	});
}

function getOtherLocations(curLat, curLong) {     
    var response;
    var request = new XMLHttpRequest();
    var result = "login=" + username + "&lat=" + curLat + "&lng=" + curLong;

    request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            response = JSON.parse(request.responseText);
            console.log(response);
            displayOtherPeople(response.people);
            displayLandmarks(response.landmarks);
        }
    }
    request.send(result);
}

function displayOtherPeople(people) {
    for (person of people) {
        position = new google.maps.LatLng(person.lat, person.lng);
        
        //If my username is returned from datastore, still display my unique icon
        if(person.login == username) {
            addMarker(position, person.login + "'s Location", "me");
        }
        //For other users, display the icon for others
        else {
            addMarker(position, person.login + "'s Location", "other");
        }
    }
}

function displayLandmarks(landmarks) {
    for (landmark of landmarks) {
        position = new google.maps.LatLng(landmark.geometry.coordinates[1], 
                                          landmark.geometry.coordinates[0]);
        addMarker(position, landmark.properties.Details, "landmark");
    }
}

function calculateDistanceTo(otherPosition) {
    console.log("opos " + otherPosition);
    navigator.geolocation.getCurrentPosition(function(curPosition) {
        /* TODO: remove hard-coded location */
        /* Note: My IP address maps to Everett, MA for some reason, which shows no landmarks.*/
        latitude =  /*curPosition.coords.latitude*/   42.40606509140626;
        longitude = /*curPosition.coords.longitude*/ -71.12196830120284;
        myPosition = new google.maps.LatLng(latitude, longitude);
        distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(myPosition, otherPosition);
        console.log("in dmet " + distanceInMeters);
        //Convert distanceInMeters to the distance in miles
        currentDistance = distanceInMeters * 0.000621371;
    });
    
//    //Convert distanceInMeters to the distance in miles and return
//    console.log("out dmet " + distanceInMeters);
//    return distanceInMeters * 0.000621371;
}