import '../css/style.css';

import React from 'react';
import ReactDOM from 'react-dom';

import LocationSearchButton from './search/location-search-button.jsx';
import {newPublicArtUpload} from './upload/new-location.jsx'
import {initMap} from './utils/init-map'
import { createClient } from './utils/client-handler';

import Amplify from 'aws-amplify';
import aws_config from './aws-exports';
import {withAuthenticator, ConfirmSignUp, Greetings, SignIn, SignUp} from 'aws-amplify-react';

// Make the auth client accessible to everything
window.client = createClient();

Amplify.configure(aws_config);
var map = initMap();
var locationMarkers = [];

map.addListener('click', function(event) {
    var latLng = event.latLng;
    var lat = latLng.lat();
    var lng = latLng.lng();

    // TODO: this should disappear when the 'close' button is clicked in the new div.
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
map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(locationSearchDiv);

function searchButton() {
    return (
        <LocationSearchButton 
            map={map}
            markersCallback={markersCallback}
        />
    )
} 
let SearchButtonWithAuthenticator = withAuthenticator(searchButton, {
    includeGreetings: true,
    authenticatorComponents: [
        <SignIn/>,
        <SignUp/>,
        <ConfirmSignUp/>,
        <Greetings
            inGreeting="Welcome"
            outGreeting="Please sign in or sign up."
        />
    ],
    // TODO: get rid of phone number somehow?
    usernameAttributes: 'email'
});
ReactDOM.render(
    <SearchButtonWithAuthenticator/>, locationSearchDiv
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