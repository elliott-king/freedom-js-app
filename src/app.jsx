import gql from 'graphql-tag';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import aws_config from './aws-exports';
import {getPublicArtWithinBoundingBox} from './graphql/queries';
import '../css/style.css';
import {GoogleOauth} from '@aws-amplify/core';
import { PassThrough} from 'stream';

import React from 'react';
import ReactDOM from 'react-dom';

/*
MAJOR TODOS:
- make the map a react component
- move everything to new file (except maybe initMap())
*/

console.log("App started");

var map;
var markers = [];

const client = new AWSAppSyncClient({
    url: aws_config.aws_appsync_graphqlEndpoint,
    region: aws_config.aws_appsync_region,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: aws_config.aws_appsync_apiKey,
    }
});



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
    var bounds = map.getBounds();
    console.log("Bounds: ", bounds.toString());

    client.query({
        query: gql(getPublicArtWithinBoundingBox),
        variables: {
            top_right_gps: JSON.stringify({
                lat: bounds.getNorthEast().lat(),
                lng: bounds.getNorthEast().lng()
            }),
            bottom_left_gps: JSON.stringify({
                lat: bounds.getSouthWest().lat(),
                lng: bounds.getSouthWest().lng()
            })
        }
    }).then(({data: { getPublicArtWithinBoundingBox } } ) => {
        deleteMarkers();

        console.log("Listing public art from getWithinBoundingBox: ");
        console.log(getPublicArtWithinBoundingBox);

        for (var publicArt of getPublicArtWithinBoundingBox) {
            let location = JSON.parse(publicArt.location); 

            // TODO: FIXME
            location.lng = location.lon;

            var marker = new google.maps.Marker({position: location, map: map, title: publicArt.name});
            markers.push(marker);
        }

        showMarkers()
    }).catch(e => {
        console.error(e.toString());
    });
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function showMarkers() {
    setMapOnAll(map);
}
function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
}
