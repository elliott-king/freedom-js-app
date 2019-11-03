/* global google */

import gql from 'graphql-tag';
import {getPublicArtWithinBoundingBox, getPublicArt} from '../graphql/queries';
import React from 'react';
import ReactDOM from 'react-dom';

import LocationInfoDiv from './location-info-div.jsx';
import {openSidebar} from '../utils/set-map-and-sidebar-style';

let prevMarker = null;

/** Queries api for a given location and renders it in the sidebar.
 *
 * @param  {string} id ID of location desired
 */
function revealLocationInfo(id) {
  window.keyClient.query({
    query: gql(getPublicArt),
    variables: {id: id},
    fetchPolicy: 'network-only',
  }).then(( {data: {getPublicArt}}) => {
    console.debug('Generating info for:', getPublicArt);

    const sidebar = document.getElementById('sidebar');
    ReactDOM.unmountComponentAtNode(sidebar);
    ReactDOM.render(
        <LocationInfoDiv
          name={getPublicArt.name}
          id={getPublicArt.id}
          photos={getPublicArt.photos}
          permanent={getPublicArt.permanent}
          dates={getPublicArt.date_range}
        />,
        sidebar
    );
    openSidebar();
  }).catch((err) => console.error('Problem generating info window:', err));
}

/**
 * @param  {google.maps.Map} map a google map
 * @param  {string} filter an optional filter term
 * @param  {boolean} isPermanent search for permanent installations or not
 * @returns {Promise<Array>} Promise containing the markers for each location
 */
export function getPublicArtWithinMap(map, filter, isPermanent) {
  const bounds = map.getBounds();
  const newMarkers = [];
  console.log('Bounds: ', bounds.toString());

  const query = gql(getPublicArtWithinBoundingBox);
  const variables = {
    top_right_gps: {
      lat: bounds.getNorthEast().lat(),
      lon: bounds.getNorthEast().lng(),
    },
    bottom_left_gps: {
      lat: bounds.getSouthWest().lat(),
      lon: bounds.getSouthWest().lng(),
    },
    permanent: isPermanent,
  };
  if (filter != 'all') variables.type = filter;
  console.log('GetWithinBounds variables', variables);

  return window.keyClient.query({
    query: query,
    variables: variables,
    fetchPolicy: 'network-only',
  }).then(({data: {getPublicArtWithinBoundingBox}} ) => {
    console.debug('Public art from getWithinBoundingBox: ');
    console.debug(getPublicArtWithinBoundingBox);

    for (const publicArt of getPublicArtWithinBoundingBox) {
      const location = publicArt.location;

      // TODO: FIXME, google's format is different than elasticsearch's
      location.lng = location.lon;

      const marker = new google.maps.Marker(
          {position: location, map: map, title: publicArt.name});
      marker.addListener('click', () => {
        if (prevMarker) {
          prevMarker.setLabel(null);
        }

        console.log('querying public art:', publicArt.name, publicArt.id);
        revealLocationInfo(publicArt.id);
        marker.setLabel('A');
        prevMarker = marker;
      });
      newMarkers.push(marker);
    }
    return newMarkers;
  }).catch((e) => {
    console.error('Error searching: ' + e.toString());
    return newMarkers;
  });
}
