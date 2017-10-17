var globalLatitude = 0, globalLongitude = 0;
var myCenter = new google.maps.LatLng(globalLatitude, globalLongitude);
var username = "bBcpK9Na";
var googleMap;
var landmarksList;

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
        animation: google.maps.Animation.DROP,
        icon: markerIcons[iconType]
    });
    
    google.maps.event.addListener(mark, "click", function() {
        popup = new google.maps.InfoWindow();
        if(this.icon.url == markerIcons["landmark"].url) {
            popup.setContent(markTitle);
        }
        else if (this.icon.url == markerIcons["other"].url){
            var otherMarker = this; 
            navigator.geolocation.getCurrentPosition(function(curPosition) {
                /* TODO: remove hard-coded location */
                /* Note: My IP address maps to Everett, MA for some reason, which shows no landmarks.*/
                latitude =  /*curPosition.coords.latitude*/   42.40606509140626;
                longitude = /*curPosition.coords.longitude*/ -71.12196830120284;
                myPosition = new google.maps.LatLng(latitude, longitude);
                //Display InfoWindow showing distance to other person
                currentDistance = calculateDistance(myPosition, otherMarker.position);
                popup.setContent(markTitle + " is " + currentDistance + " miles away!");
            });
        }
        else {
            var meMarker = this;
            navigator.geolocation.getCurrentPosition(function(curPosition) {
                /* TODO: remove hard-coded location */
                /* Note: My IP address maps to Everett, MA for some reason, which shows no landmarks.*/
                latitude =  /*curPosition.coords.latitude*/   42.40606509140626;
                longitude = /*curPosition.coords.longitude*/ -71.12196830120284;
                myPosition = new google.maps.LatLng(latitude, longitude);
                if(landmarksList.length > 0){
                    closestLandmark = findClosestLandmark(myPosition);
                    closestPosition = new google.maps.LatLng(closestLandmark.geometry.coordinates[1], 
                                       closestLandmark.geometry.coordinates[0]);
                    closestDistance = calculateDistance(myPosition, closestPosition);
                    popup.setContent(closestLandmark.properties.Location_Name + " is the closest landmark, " + closestDistance + " miles away.");
                    drawPolyline(myPosition, closestPosition);
                }
                else {
                    popup.setContent("There are no landmarks close to your location.");
                }
            });
        }
        
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
            addMarker(position, person.login, "me");
        }
        //For other users, display the icon for others
        else {
            addMarker(position, person.login, "other");
        }
    }
}

function displayLandmarks(landmarks) {
    //Store list of landmarks globally for later use in findClosestLandmark function
    landmarksList = landmarks;
    
    //Display each landmark returned by the server
    for (landmark of landmarks) {
        position = new google.maps.LatLng(landmark.geometry.coordinates[1], 
                                          landmark.geometry.coordinates[0]);
        addMarker(position, landmark.properties.Details, "landmark");
    }
}

function calculateDistance(myPosition, otherPosition) {
    distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(myPosition, otherPosition);
    
    //Convert distanceInMeters to the distance in miles and return
    return distanceInMeters * 0.000621371;
}

function findClosestLandmark(myPosition) {
    var closestLandmark, closestDistance, curDistance;
    for (landmark of landmarksList) {
        markPosition = new google.maps.LatLng(landmark.geometry.coordinates[1], 
                                          landmark.geometry.coordinates[0]);
        curDistance = calculateDistance(myPosition, markPosition);
        //Initialize closestLandmark to first landmark in list
        //Check if current landmark is the closest so far
        if ((landmark == landmarksList[0]) || (curDistance < closestDistance)) {
            closestLandmark = landmark;
            closestDistance = curDistance;
        }
    }
    return closestLandmark;
}

function drawPolyline(position1, position2) {
    var points = [position1, position2];
    var polyline = new google.maps.Polyline({
        path: points,
        strokeColor: "#E67E22",
        strokeOpacity: 0.8,
        strokeWeight: 5
    });
    polyline.setMap(googleMap);
}
    