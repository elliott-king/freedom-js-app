/* eslint-disable react/jsx-key */
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import {Auth} from 'aws-amplify';

import LocationSearchButton from '../search/location-search-button.jsx';
import {newPublicArtUpload} from '../upload/new-location.jsx';
import {updateMarkers, updateUserLocationMarker} from './markers-utils';
import {openLogin} from './set-map-and-sidebar-style';

/** Show error if issue getting geolocation
 *
 * @param  {boolean} browserHasGeolocation User browser has geolocation enabled
 * @param  {google.maps.LatLng} pos Location to place the error window
 * @param  {google.maps.Map} map A google map
 */
function handleLocationError(browserHasGeolocation, pos, map) {
  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                          'Error: the geolocation service has failed.' :
                          'Error: your browser does not support geolocation.');
  infoWindow.open(map);
}

/** Centers map on current location. */
export function centerMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const pos = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      console.log('Your position: ', pos.toString());
      window.map.setCenter(pos);
    }, function() {
      handleLocationError(true, window.map.getCenter());
    });
  } else {
    handleLocationError(false, window.map.getCenter());
  }
}

/** @returns {Element} A button that will show the login form
 */
function createLoginControl() {
  const controlDiv = document.createElement('div');
  const controlUI = document.createElement('div');
  controlUI.setAttribute('class', 'map-button-ui');
  controlUI.setAttribute('id', 'login-button-ui');
  // TODO: Set control title depending on login status
  controlUI.title = 'Log in';
  controlDiv.append(controlUI);

  // Set CSS from control interior
  const controlText = document.createElement('div');
  controlText.setAttribute('class', 'map-button-text');
  controlText.setAttribute('id', 'login-button-text');
  controlText.innerHTML = 'Log in';
  controlUI.appendChild(controlText);

  // Setup click event listener to show login form
  controlUI.addEventListener('click', openLogin);

  // Button text should be different if a user is already authenticated
  Auth.currentAuthenticatedUser()
      .then(() => {
        controlUI.title = 'Log out';
        controlText.innerHTML = 'Log out';
      })
      .catch(() => {
        controlUI.title = 'Log in';
        controlText.innerHTML = 'Log in';
      });

  return controlDiv;
}

/** @returns {Element} A button that will center the map
 */
function createCenterControl() {
  const controlDiv = document.createElement('div');
  const controlUI = document.createElement('div');
  controlUI.setAttribute('class', 'map-button-ui');
  controlUI.title = 'Recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  const controlText = document.createElement('div');
  controlText.setAttribute('class', 'map-button-text');
  controlText.innerHTML = 'Center Map';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply recenter the map.
  controlUI.addEventListener('click', function() {
    centerMap();
  });

  return controlDiv;
}


/** Creates a Google map object, then initializes it with a few steps:
 * - Add custom controls
 * - Center it to user's location
 * - Set up its css
 *
 * @returns {google.maps.Map} A Google map object
 */
export function initMap() {
  const options = {
    center: {lat: 40, lng: -75},
    zoom: 15,
    streetViewControl: false,
    clickableIcons: false,
  };

  // https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    options.zoomControl = false;
    options.mapTypeControl = false;
    options.fullscreenControl = false;
  }

  const map = new google.maps.Map(document.getElementById('map'), options);

  // Only certain (modern) browsers have HTML5 geolocation
  // NOTE: this can only be done from secure context (https)
  if (navigator.geolocation) {
    centerMap();

    navigator.geolocation.watchPosition((pos) => {
      pos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      updateUserLocationMarker(pos);
    }, (err) => console.log('Error with user position update:', err));

    // Create the DIV to hold the 'center map' map control and populate it.
    const centerControlDiv = createCenterControl();
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  }

  // Create the DIV to hold the login button.
  const loginControlDiv = createLoginControl();
  loginControlDiv.index = 2;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(loginControlDiv);

  // Create div that holds search button
  // Adding custom controls:
  // https://github.com/tomchentw/react-google-maps/issues/818
  const locationSearchDiv = document.createElement('div');
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationSearchDiv);
  ReactDOM.render(
      <LocationSearchButton
        markersCallback={updateMarkers}
      />,
      locationSearchDiv
  );

  map.addListener('click', function(event) {
    Auth.currentAuthenticatedUser()
        .then(() => {
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
          updateMarkers([newLocationMarker]);

          newPublicArtUpload(lat, lng);
        }).catch(() => console.log('Cannot add new marker. No user authenticated.'));
  });
  return map;
}
