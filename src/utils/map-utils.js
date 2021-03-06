/* eslint-disable react/jsx-key */
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';

// import {EventSearchButton, PublicArtSearchButton}
//   from '../search/location-search-button.jsx';
import {openSearchDialog} from '../search/search-div.jsx';
import {updateMarkers, updateUserLocationMarker} from './markers-utils';

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
      window.map.setCenter(pos);
    }, function() {
      handleLocationError(true, window.map.getCenter());
    });
  } else {
    handleLocationError(false, window.map.getCenter());
  }
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

  // Create div that holds search button
  // Adding custom controls:
  // https://github.com/tomchentw/react-google-maps/issues/818
  const searchDiv = document.createElement('div');
  searchDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(searchDiv);
  ReactDOM.render(
      <div
        className="map-button-ui"
        title="Find nearby events and public art">
        <div className="map-button-text"
          onClick={() => openSearchDialog(updateMarkers)}>
          Search
        </div>
      </div>,
      searchDiv,
  );

  return map;
}
