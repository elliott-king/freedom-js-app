/* global google */

import setMapAndSidebarStyle from './set-map-and-sidebar-style';

/**
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

/** Centers map on current location.
 *
 * @param {google.maps.Map} map A google map
 */
function centerMap(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const pos = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      console.log('Your position: ', pos.toString());
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    handleLocationError(false, map.getCenter());
  }
}


/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 *
 * @param {Element} controlDiv The div to house this button
 * @param {google.maps.Map} map A Google map
 */
function addCenterControl(controlDiv, map) {
  // Set CSS for the control border.
  const controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  const controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Center Map';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    centerMap(map);
  });
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
  };

  // https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    options.zoomControl = false;
    options.mapTypeControl = false;
    options.fullscreenControl = false;
  }

  const map = new google.maps.Map(document.getElementById('map'), options);

  // Try HTML5 geolocation
  // NOTE: this can only be done from secure context (https)
  if (navigator.geolocation) {
    centerMap(map);

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    const centerControlDiv = document.createElement('div');
    addCenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  }

  setMapAndSidebarStyle(false);
  return map;
}
