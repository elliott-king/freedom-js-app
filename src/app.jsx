/* eslint-disable react/jsx-key */
/* global google */

import '../css/style.css';
import React from 'react';
import ReactDOM from 'react-dom';

import LocationSearchButton from './search/location-search-button.jsx';
import {newPublicArtUpload} from './upload/new-location.jsx';
import {initMap} from './utils/init-map';
import {createClient} from './utils/aws-client-handler';

import Amplify from 'aws-amplify';
// eslint-disable-next-line camelcase
import aws_config from './aws-exports';
import {withAuthenticator, ConfirmSignUp, Greetings, SignIn, SignUp}
  from 'aws-amplify-react';

// Make the auth client accessible to everything
window.client = createClient();

Amplify.configure(aws_config);
const map = initMap();
let locationMarkers = [];

map.addListener('click', function(event) {
  const latLng = event.latLng;
  const lat = latLng.lat();
  const lng = latLng.lng();

  // TODO: should disappear when the 'close' button clicked in new-location div.
  const newLocationMarker = new google.maps.Marker({
    position: {lng: lng, lat: lat},
    map: map,
    title: 'New location',
    label: 'N',
  });
  markersCallback([newLocationMarker]);

  newPublicArtUpload(lat, lng);
});

// Taken from:
// https://github.com/tomchentw/react-google-maps/issues/818
const locationSearchDiv = document.createElement('div');
map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(locationSearchDiv);
/**
 * @returns {LocationSearchButton} A search button with our required parameters.
 */
function searchButton() {
  return (
    <LocationSearchButton
      map={map}
      markersCallback={markersCallback}
    />
  );
}
const SearchButtonWithAuthenticator = withAuthenticator(searchButton, {
  includeGreetings: true,
  authenticatorComponents: [
    <SignIn/>,
    <SignUp/>,
    <ConfirmSignUp/>,
    <Greetings
      inGreeting="Welcome"
    />,
  ],
  // TODO: get rid of phone number somehow?
  usernameAttributes: 'email',
});
ReactDOM.render(
    <SearchButtonWithAuthenticator/>, locationSearchDiv
);

// Functions to modify the markers on the map.
/**
 * @param  {google.maps.Map} map A google map
 * @param  {Array} markers The markers to add to the map
 */
function setMapOnAll(map, markers) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
/**
 * @param  {Array} markers The markers to add to the map
 */
function showMarkers(markers) {
  setMapOnAll(map, markers);
}
/**
 * @param  {Array} markers The markers to remove from the map
 */
function deleteMarkers(markers) {
  setMapOnAll(null, markers);
}
/**
 * @param  {Array} newMarkers The new markers for the map
 */
function markersCallback(newMarkers) {
  deleteMarkers(locationMarkers);
  locationMarkers = newMarkers;
  showMarkers(locationMarkers);
}
