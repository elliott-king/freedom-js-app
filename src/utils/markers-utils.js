/* global google */
let locationMarkers = [];
let currentUserLocationMarker;

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
/**
 * @param  {google.maps.LatLng} location The user's location
 */
export function updateUserLocationMarker(location) {
  if (currentUserLocationMarker) deleteMarkers([currentUserLocationMarker]);
  currentUserLocationMarker = new google.maps.Marker({
    title: 'Your location',
    position: location,
    // marker as SVG https://stackoverflow.com/questions/24413766/
    icon: {
      // eslint-disable-next-line max-len
      url: 'data:image/svg+xml;charset=UTF-8,%0A    %3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" viewBox%3D"0 0 36 36" width%3D"46" height%3D"46"%3E%0A        %3Cg opacity%3D"0.5"%3E%0A            %3Ccircle fill%3D"rgba(165%2C 216%2C 245%2C 1)" cx%3D"18" cy%3D"18" r%3D"16.5"%2F%3E%0A        %3C%2Fg%3E%0A        %3Ccircle fill%3D"rgba(0%2C 115%2C 187%2C 1)" cx%3D"18" cy%3D"18" r%3D"6"%2F%3E%0A        %3Cpath fill%3D"rgba(255%2C 255%2C 255%2C 1)" d%3D"M18%2C25a7%2C7%2C0%2C1%2C1%2C7-7A7%2C7%2C0%2C0%2C1%2C18%2C25Zm0-12a5%2C5%2C0%2C1%2C0%2C5%2C5A5%2C5%2C0%2C0%2C0%2C18%2C13Z"%2F%3E%0A    %3C%2Fsvg%3E%0A',
      anchor: new google.maps.Point(21, 21),
    },
  });
  showMarkers([currentUserLocationMarker]);
}
