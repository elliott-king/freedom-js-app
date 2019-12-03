/* global google */

import gql from 'graphql-tag';
import {getPublicArtWithinBoundingBox, getPublicArt, getEventWithinBoundingBox, getEvent}
  from '../graphql/queries';
import React from 'react';
import ReactDOM from 'react-dom';

import LocationInfoDiv from './location-info-div.jsx';
import {openSidebar} from '../utils/set-map-and-sidebar-style';
import {locationType} from '../utils/constants';

let prevMarker = null;

/** Queries api for a given location and renders it in the sidebar.
 *
 * @param  {string} id ID of location desired
 * @param {locationType} type type of location to look up
 */
function revealLocationInfo(id, type) {
  let query;
  let s;
  if (type == locationType.PUBLIC_ART) {
    query = getPublicArt;
    s = 'getPublicArt';
  } else if (type == locationType.EVENT) {
    query = getEvent;
    s = 'getEvent';
  } else {
    throw new TypeError('To get info for a location, it must have a type of: ' +
                        Object.keys(locationType).toString());
  }

  window.keyClient.query({
    query: gql(query),
    variables: {id: id},
    fetchPolicy: 'network-only',
  }).then( ({data} ) => {
    const location = data[s];

    const sidebar = document.getElementById('sidebar');
    ReactDOM.unmountComponentAtNode(sidebar);
    ReactDOM.render(
        <LocationInfoDiv
          location={location}
          type={type}
        />,
        sidebar
    );
    openSidebar();
  }).catch((err) => console.error('Problem generating info window:', err));
}

/**
 * @param  {google.maps.Map} map a google map
 * @returns {Promise<Array<google.maps.Marker>>} a promise containing the events in map markers
 */
export function getEventWithinMap(map) {
  const bounds = map.getBounds();
  const newMarkers = [];
  console.log('Bounds:', bounds.toString());

  const query = gql(getEventWithinBoundingBox);
  const variables = {
    search: {
      // TODO: date variables.
      top_right_gps: {
        lat: bounds.getNorthEast().lat(),
        lon: bounds.getNorthEast().lng(),
      },
      bottom_left_gps: {
        lat: bounds.getSouthWest().lat(),
        lon: bounds.getSouthWest().lng(),
      },
    },
  };

  // TODO: add:
  // if (filter) date
  // if (filter) type
  console.log('GetWithinBounds variables', variables);
  return window.keyClient.query({
    query: query,
    variables: variables,
    fetchPolicy: 'network-only',
  }).then(({data: {getEventWithinBoundingBox}}) => {
    console.debug('Events from getWithinBoundingBox:');
    console.debug(getEventWithinBoundingBox);

    for (const event of getEventWithinBoundingBox) {
      const location = event.location;
      location.lng = location.lon;

      const marker = new google.maps.Marker({
        position: location, map: map, title: event.name,
      });
      marker.addListener('click', () => {
        if (prevMarker) prevMarker.setLabel(null);

        console.log('querying event:', event.name, event.id);
        revealLocationInfo(event.id, locationType.EVENT); // TODO: fixme
        marker.setLabel('A');
        prevMarker = marker;
      });
      newMarkers.push(marker);
    }
    return newMarkers;
  }).catch((err) => {
    console.error('Error searching for events:', err);
    return newMarkers;
  });
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
    search: {
      top_right_gps: {
        lat: bounds.getNorthEast().lat(),
        lon: bounds.getNorthEast().lng(),
      },
      bottom_left_gps: {
        lat: bounds.getSouthWest().lat(),
        lon: bounds.getSouthWest().lng(),
      },
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
        revealLocationInfo(publicArt.id, locationType.PUBLIC_ART);
        marker.setLabel('A');
        prevMarker = marker;
      });
      newMarkers.push(marker);
    }
    return newMarkers;
  }).catch((e) => {
    console.error('Error searching for public art:' + e.toString());
    return newMarkers;
  });
}
