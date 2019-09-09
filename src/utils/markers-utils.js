/* global google */
let locationMarkers = [];

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
  setMapOnAll(window.map, markers);
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
export function updateMarkers(newMarkers) {
  deleteMarkers(locationMarkers);
  locationMarkers = newMarkers;
  showMarkers(locationMarkers);
}
