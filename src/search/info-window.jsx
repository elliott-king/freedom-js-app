import gql from 'graphql-tag';
import {getPublicArtWithinBoundingBox, getPublicArt} from '../graphql/queries';
import React from 'react';
import ReactDOM from 'react-dom';

import LocationInfoDiv from './location-info-div.jsx';

var previousInfoWindow = false;

function createInfoWindow(id, callback) {
    
    window.client.query({
        query: gql(getPublicArt),
        variables: { id: id},
        fetchPolicy: 'network-only',
    }).then(( {data: {getPublicArt}}) => {
        console.debug("Creating info window for for:", getPublicArt);

        // Content of infoWindow is a DOM element, not a string representing HTML.
        // https://developers.google.com/maps/documentation/javascript/infowindows
        var content = document.createElement('div');
        ReactDOM.render(
            <LocationInfoDiv
                name={getPublicArt.name}
                id={getPublicArt.id}
                // TODO: photo resizing: infowindow final size is all over the place.
                photos={getPublicArt.photos}
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
    }).then(infoWindow => callback(infoWindow))
    .catch(err => console.error("Problem generating info window:", err));
}

export function getPublicArtWithinMap(map, filter, callback) {

    var bounds = map.getBounds();
    var new_markers = [];
    console.log("Bounds: ", bounds.toString());

    var query = gql(getPublicArtWithinBoundingBox);
    var variables = {
        top_right_gps: {
            lat: bounds.getNorthEast().lat(),
            lon: bounds.getNorthEast().lng()
        },
        bottom_left_gps: {
            lat: bounds.getSouthWest().lat(),
            lon: bounds.getSouthWest().lng()
        }
    };
    if (filter != 'all') variables.type = filter;

    window.client.query({
        query: query,
        variables: variables,
        fetchPolicy: 'network-only'
    }).then(({data: { getPublicArtWithinBoundingBox } } ) => {

        console.debug("Public art from getWithinBoundingBox: ");
        console.debug(getPublicArtWithinBoundingBox);

        for (let publicArt of getPublicArtWithinBoundingBox) {
            let location = publicArt.location;

            // TODO: FIXME, google's format is different than elasticsearch's
            location.lng = location.lon;

            let marker = new google.maps.Marker({position: location, map: map, title: publicArt.name});
            marker.addListener("click", function() {
                if (previousInfoWindow) {
                    previousInfoWindow.close();
                }
                console.log("querying public art:", publicArt.name, publicArt.id);
                createInfoWindow(publicArt.id, function(infoWindow) {
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