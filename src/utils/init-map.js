

function handleLocationError(browserHasGeolocation, pos) {
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: the geolocation service has failed.' : 
                          'Error: your browser does not support geolocation.');
    infoWindow.open(map);
}

export function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -75},
        zoom: 15
    });

    // Try HTML5 geolocation
    // NOTE: this can only be done from secure context (https)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log("Your position: ", pos.toString());
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser does not support HTML5 geolocation
        handleLocationError(false, map.getCenter());
    }
    return map;
}