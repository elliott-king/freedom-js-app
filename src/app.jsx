import '../css/style.css';

import React from 'react';
import ReactDOM from 'react-dom';

import LocationSearchDiv from './search/location-search.jsx';
import {newPublicArtUpload} from './upload/new-location.jsx'
import {initMap} from './utils/init-map'

import Amplify from 'aws-amplify';
import aws_config from './aws-exports';

Amplify.configure(aws_config);
var map = initMap();
var locationMarkers = [];

map.addListener('click', function(event) {
    var latLng = event.latLng;
    var lat = latLng.lat();
    var lng = latLng.lng();

    var newLocationMarker = new google.maps.Marker({
        position: {lng: lng, lat: lat}, 
        map: map, 
        title: "New location",
        label: "N"
    });
    markersCallback([newLocationMarker]);

    newPublicArtUpload(lat, lng);
});

// Taken from:
// https://github.com/tomchentw/react-google-maps/issues/818
var locationSearchDiv = document.createElement('div');
map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationSearchDiv);
ReactDOM.render(
    <LocationSearchDiv 
        map={map}
        markersCallback={markersCallback}
    />,
    locationSearchDiv
);

// Functions to modify the markers on the map.
function setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function showMarkers(markers) {
    setMapOnAll(map, markers);
}
function deleteMarkers(markers) {
    setMapOnAll(null, markers);
}
function markersCallback(new_markers) {
    deleteMarkers(locationMarkers);
    locationMarkers = new_markers
    showMarkers(locationMarkers);
}