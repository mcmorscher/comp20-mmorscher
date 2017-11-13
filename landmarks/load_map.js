var latitude = 0, longitude = 0;
var myCenter = new google.maps.LatLng(latitude, longitude);
var username = "bBcpK9Na";
var googleMap;
var landmarksList;

var markerIcons = {
    me:      { url: "me_emoji.png", scaledSize: new google.maps.Size(40,40) },
    other:   { url: "other_emoji.png", scaledSize: new google.maps.Size(40,40) },
    landmark:{ url: "landmark.png", scaledSize: new google.maps.Size(40,40) } 
}

//Get current location and use to populate map with others and landmarks
function findCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function(curPosition) {
        latitude =  curPosition.coords.latitude;
        longitude = curPosition.coords.longitude;
        
        myCenter = new google.maps.LatLng(latitude, longitude);
        googleMap.panTo(myCenter);
        
        addMarker(myCenter, username, "me");
        
        getOtherLocations(latitude, longitude);
    });
}

//Initialization function; called when page loads
function loadMap() {
    googleMap = new google.maps.Map(document.getElementById("map"), {
    center: myCenter,
    zoom: 15
    });

    findCurrentLocation();
}

//Adds a marker with the icon and position specified
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
        myPosition = new google.maps.LatLng(latitude, longitude);
        //Display InfoWindow with landmark details
        if(this.icon.url == markerIcons["landmark"].url) {
            popup.setContent(markTitle);
        }
        //Display InfoWindow showing distance to other person
        else if (this.icon.url == markerIcons["other"].url){
            currentDistance = calculateDistance(myPosition, this.position);
            popup.setContent(markTitle + " is " + currentDistance + " miles away!");
        }
        //Display InfoWindow showing closest landmark and render polyline
        else {
            if(landmarksList.length > 0){
                closestLandmark = findClosestLandmark(myPosition);
                closestPosition = new google.maps.LatLng(closestLandmark.geometry.coordinates[1], 
                                   closestLandmark.geometry.coordinates[0]);
                closestDistance = calculateDistance(myPosition, closestPosition);
                popup.setContent("My Location &#40;" + username + "&#41; <br> <br> The closest landmark is: "  + closestLandmark.properties.Location_Name + ".<br> It is " + closestDistance + " miles away.");
                drawPolyline(myPosition, closestPosition);
            }
            //If the landmarks list returns empty, inform the user
            else {
                popup.setContent("There are no landmarks close to your location.");
            }
        }
		popup.open(map, this);
	});
}

//Request the locations of other people and nearby landmarks from the datastore
function getOtherLocations(curLat, curLong) {     
    var response;
    var request = new XMLHttpRequest();
    var result = "login=" + username + "&lat=" + curLat + "&lng=" + curLong;
    
    request.open("POST", "https://radiant-ocean-68966.herokuapp.com/sendLocation", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            response = JSON.parse(request.responseText);            
            displayOtherPeople(response.people);
            displayLandmarks(response.landmarks);
        }
    }
    request.send(result);
}

//Use datastore response to place other people on the map
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

//Use datastore response to place landmartks on the map
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

//Helper function to calculate distance in miles between positions
function calculateDistance(myPosition, otherPosition) {
    distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(myPosition, otherPosition);
    return distanceInMeters * 0.000621371;
}

//Find closest landmark by looping through list and calculating distance for each
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

//Draw a formatted polyline between the two specified positions
function drawPolyline(position1, position2) {
    var points = [position1, position2];
    var polyline = new google.maps.Polyline({
        path: points,
        strokeColor: "#E67E22",
        strokeOpacity: 0.7,
        strokeWeight: 5
    });
    polyline.setMap(googleMap);
}
    