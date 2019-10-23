/* global google */

import '../css/style.css';
import React from 'react';
import ReactDOM from 'react-dom';

import LocationSearchButton from './search/location-search-button.jsx';
import {newPublicArtUpload} from './upload/new-location.jsx';
import {initMap} from './utils/map-utils';
import {createClient} from './utils/aws-client-handler';
import {updateMarkers} from './utils/markers-utils';

import Amplify from 'aws-amplify';
// eslint-disable-next-line camelcase
import aws_config from './aws-exports';

// Required setup for AWS Amplify utilities (API, S3, Auth, etc..)
Amplify.configure(aws_config);

// We create global auth clients so anything can call gql queries
console.debug('creating client...');
createClient();

// Map global so that markers can be added from anywhere
console.debug('initializing map...');
window.map = initMap();

window.map.addListener('click', function(event) {
  const latLng = event.latLng;
  const lat = latLng.lat();
  const lng = latLng.lng();

  // TODO: should disappear when the 'close' button clicked in new-location div.
  const newLocationMarker = new google.maps.Marker({
    position: {lng: lng, lat: lat},
    map: window.map,
    title: 'New location',
    label: 'N',
  });
  updateMarkers([newLocationMarker]);

  newPublicArtUpload(lat, lng);
});

// Adding custom controls:
// https://github.com/tomchentw/react-google-maps/issues/818
const locationSearchDiv = document.createElement('div');
window.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationSearchDiv);
ReactDOM.render(
    <LocationSearchButton
      markersCallback={updateMarkers}
    />,
    locationSearchDiv
);
