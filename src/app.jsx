import '../css/style.css';
import {GoogleOauth} from '@aws-amplify/core';
import { PassThrough} from 'stream';

import React from 'react';
import ReactDOM from 'react-dom';
import AWSClientHandler from './utils/client-handler';

/*
MAJOR TODOS:
- make the map a react component
- move everything to new file (except maybe initMap())
*/

console.log("App started");

var map;
var client = new AWSClientHandler()

class PublicArtText extends React.Component {
    render() {
        return (
            <div className="public-art-text">Public Art</div>
        )
    }
}

class PublicArtUi extends React.Component {
    render() {
        return (
            <div className="public-art-ui" 
            title='Click to find nearby public art.' 
            onClick={getPublicArtWithinMap}>
                <PublicArtText />
            </div>
        )
    }
}

class PublicArtControlDiv extends React.Component {

    render() {
        return <div className="public-art-control" index="1">
            <PublicArtUi />
        </div>
    }
}

function initMap() {
    console.log("Calling initMap");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -75},
        zoom: 15
    });

    // Taken from:
    // https://github.com/tomchentw/react-google-maps/issues/818
    var publicArtControlDiv = document.createElement('div');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(publicArtControlDiv);
    ReactDOM.render(
        <PublicArtControlDiv/>,
        publicArtControlDiv
    )

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log("Your position: ", pos.toString());
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser does not support HTML5 geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
initMap();

// TODO: infoWindow does not exist
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: the geolocation service has failed.' : 
                          'Error: your browser does not support geolocation.');
    infoWindow.open(map);
}

function getPublicArtWithinMap() {
    client.getPublicArtWithinMap(map, function(markers) {
        deleteMarkers(markers);
        showMarkers(markers);
    });
}
       
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