import gql from 'graphql-tag';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import aws_config from './aws-exports';
import {getPublicArtWithinBoundingBox} from './graphql/queries';
import '../css/style.css';
import {GoogleOauth} from '@aws-amplify/core';
import { PassThrough} from 'stream';
// import PublicArtControlDiv from './components/map-controls.jsx';

import React from 'react';
import ReactDOM from 'react-dom';


console.log("App started");

var map;
var markers = [];


// TODO: remove this for a button that fulfills this feature.
// google.maps.event.addListener(map, 'bounds_changed', getPublicArtWithinMap);

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
    // renderText() {
    //     return <PublicArtText />;
    // }
    render() {
        return (
            // <div className="public-art-ui">
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

    // TODO: react
    // var publicArtControlDiv = document.createElement('div');
    // var publicArtControl = new FindPublicArtControl(publicArtControlDiv, map);

    // var publicArtControlDiv = document.createElement('div');
    // publicArtControlDiv.appendChild(React.createElement(PublicArtUi));

    // var publicArtControlDiv = controls.PublicArtControlDiv();
    // var publicArtControlDiv = React.createElement(PublicArtControlDiv);
    // publicArtControlDiv.addEventListener('click', function() {
    //     getPublicArtWithinMap();
    // })

    // ReactDOM.render(
    //     // <PublicArtControlDiv />,
    //     publicArtControlDiv,
    //     document.getElementById('root')
    // );
    
    // publicArtControlDiv.index = 1;
    // console.log(publicArtControlDiv);

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



/**
 * The FindPublicArtControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function FindPublicArtControl(controlDiv, map) {
    // Control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to find nearby public art.';
    controlDiv.appendChild(controlUI);

    // control interior & text
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial, sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Public Art';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
        getPublicArtWithinMap();
    })
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
