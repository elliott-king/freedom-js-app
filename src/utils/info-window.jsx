import gql from 'graphql-tag';
import {getPublicArtWithinBoundingBox, getPublicArt} from '../graphql/queries';
import React from 'react';
import ReactDOM from 'react-dom';

import FlagLocationPopup from './flag-form.jsx';
// import { createClient } from './client-handler';

var previousInfoWindow = false;
// const client = createClient();

function createInfoWindow(publicArt, client) {
    console.debug("Creating info window for for:", publicArt);

    // Content of infoWindow is a DOM element, not a string representing HTML.
    // https://developers.google.com/maps/documentation/javascript/infowindows
    

    var content = document.createElement('div');
    ReactDOM.render(
        <FlagLocationPopup
            client={client}
            name={publicArt.name}
            id={publicArt.id}
            // TODO: photo resizing: infowindow final size is all over the place.
            photos={publicArt.photos}
        />,
        content
    );

    // For some reason, I can't call var infoWindow = new google.maps.InfoWindow().
    // The creation of the infoWindow creates an error: 
    // 'function a.addListener() does not exist' ...?
    // HOWEVER, it works fine if we just return it straight up.
    return new google.maps.InfoWindow({
        content: content
    });
}

function getPublicArtInfoWindow(id, client, callback) {
    // var client = createClient();

    client.query({
        query: gql(getPublicArt),
        variables: { id: id },
        fetchPolicy: 'network-only',
    }).then(({data: {getPublicArt}}) => {
        
        var infoWindow = createInfoWindow(getPublicArt, client);
        callback(infoWindow);
    });

}

export function getPublicArtWithinMap(map, filter, client, callback) {
    // var client = createClient();

    var bounds = map.getBounds();
    var new_markers = [];
    console.debug("Bounds: ", bounds.toString());

    var query = gql(getPublicArtWithinBoundingBox);
    var variables = {
        top_right_gps: JSON.stringify({
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng()
        }),
        bottom_left_gps: JSON.stringify({
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng()
        })
    };
    if (filter != 'all') variables.type = filter;

    client.query({
        query: query,
        variables: variables
    }).then(({data: { getPublicArtWithinBoundingBox } } ) => {

        console.debug("Public art from getWithinBoundingBox: ");
        console.debug(getPublicArtWithinBoundingBox);

        for (let publicArt of getPublicArtWithinBoundingBox) {
            let location = JSON.parse(publicArt.location); 

            // TODO: FIXME, google's format is different than elasticsearch's
            location.lng = location.lon;

            let marker = new google.maps.Marker({position: location, map: map, title: publicArt.name});
            marker.addListener("click", function() {
                if (previousInfoWindow) {
                    previousInfoWindow.close();
                }
                console.log("querying public art:", publicArt.name, publicArt.id);
                getPublicArtInfoWindow(publicArt.id, client, function(infoWindow) {
                    previousInfoWindow = infoWindow;
                    previousInfoWindow.open(map, marker);
                });
            });
            new_markers.push(marker);
        }

        callback(new_markers);
    }).catch(e => {
        console.error(e.toString());
    });
};