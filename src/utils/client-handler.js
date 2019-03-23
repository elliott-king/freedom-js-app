import gql from 'graphql-tag';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import aws_config from '../aws-exports';
import {getPublicArtWithinBoundingBox, getPublicArt} from '../graphql/queries';

function createClient() {
    return new AWSAppSyncClient({
        url: aws_config.aws_appsync_graphqlEndpoint,
        region: aws_config.aws_appsync_region,
        auth: {
            type: AUTH_TYPE.API_KEY,
            apiKey: aws_config.aws_appsync_apiKey,
        }
    });
}

function createInfoWindow(publicArt) {
    var contentString = '<div id="content">' +
        '<h3 id="name">' + publicArt.name + '</h3>';

    // TODO: photo resizing
    if (publicArt.photos.length > 0) {
        var photo = JSON.parse(publicArt.photos[0]);
        contentString += '<img src="' + photo.link + '">';
    }

    return new google.maps.InfoWindow({
        content: contentString,
    });
}

function getPublicArtInfoWindow(name, callback) {
    var client = createClient()

    client.query({
        query: gql(getPublicArt),
        variables: { name: name },
    }).then(({data: {getPublicArt}}) => {
        
        var infoWindow = createInfoWindow(getPublicArt);
        callback(infoWindow);
    })

}

export function GetPublicArtWithinMap(map, filter, callback) {
    var client = createClient();

    var bounds = map.getBounds();
    var new_markers = [];
    console.log("Bounds: ", bounds.toString());

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

        console.log("Public art from getWithinBoundingBox: ");
        console.log(getPublicArtWithinBoundingBox);

        for (var publicArt of getPublicArtWithinBoundingBox) {
            let location = JSON.parse(publicArt.location); 

            // TODO: FIXME
            location.lng = location.lon;

            let marker = new google.maps.Marker({position: location, map: map, title: publicArt.name});
            marker.addListener("click", function() {
                console.log("Getting info window and photo for:", publicArt.name);
                getPublicArtInfoWindow(publicArt.name, function(infoWindow) {
                    infoWindow.open(map, marker);
                });
            });
            new_markers.push(marker);
        }

        callback(new_markers);
    }).catch(e => {
        console.error(e.toString());
    });
};