import gql from 'graphql-tag';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import aws_config from '../aws-exports';
import {getPublicArtWithinBoundingBox} from '../graphql/queries';

export default class AWSClientHandler {

    constructor() {
        this.client = new AWSAppSyncClient({
            url: aws_config.aws_appsync_graphqlEndpoint,
            region: aws_config.aws_appsync_region,
            auth: {
                type: AUTH_TYPE.API_KEY,
                apiKey: aws_config.aws_appsync_apiKey,
            }
        });
    }

    getPublicArtWithinMap(map, callback) {
        var bounds = map.getBounds();
        var new_markers = [];
        console.log("Bounds: ", bounds.toString());

        this.client.query({
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

            console.log("Listing public art from getWithinBoundingBox: ");
            console.log(getPublicArtWithinBoundingBox);

            for (var publicArt of getPublicArtWithinBoundingBox) {
                let location = JSON.parse(publicArt.location); 

                // TODO: FIXME
                location.lng = location.lon;

                var marker = new google.maps.Marker({position: location, map: map, title: publicArt.name});
                new_markers.push(marker);
            }

            callback(new_markers);
        }).catch(e => {
            console.error(e.toString());
        });
    }
}