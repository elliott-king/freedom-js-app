/* eslint-disable react/jsx-key */
/* global google */

import '../css/style.css';
import React from 'react';
import ReactDOM from 'react-dom';

import LocationSearchButton from './search/location-search-button.jsx';
import {newPublicArtUpload} from './upload/new-location.jsx';
import {initMap} from './utils/init-map';
import {createClient} from './utils/aws-client-handler';
import {updateMarkers} from './utils/markers-utils';

import Amplify from 'aws-amplify';
// eslint-disable-next-line camelcase
import aws_config from './aws-exports';
import {withAuthenticator, ConfirmSignUp, Greetings, SignIn, SignUp}
  from 'aws-amplify-react';

// Make the auth client accessible to everything
window.client = createClient();
// Map is also accessible to everything.
window.map = initMap();

Amplify.configure(aws_config);

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

// Taken from:
// https://github.com/tomchentw/react-google-maps/issues/818
const locationSearchDiv = document.createElement('div');
window.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(locationSearchDiv);
/**
 * @returns {LocationSearchButton} A search button with our required parameters.
 */
function searchButton() {
  return (
    <LocationSearchButton
      markersCallback={updateMarkers}
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
