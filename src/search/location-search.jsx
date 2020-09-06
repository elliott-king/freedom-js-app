/* global google */

import gql from 'graphql-tag';
import {getPublicArtWithinBoundingBox, getPublicArt, getEventWithinBoundingBox, getEvent}
  from '../graphql/queries';
import React from 'react';
import ReactDOM from 'react-dom';

import LocationInfoDiv from './location-info-div.jsx';
import {openSidebar} from '../utils/set-map-and-sidebar-style';
import {LOCATION_TYPE} from '../utils/constants';

let prevMarker = null;

/** Queries api for a given location and renders it in the sidebar.
 *
 * @param  {string} id ID of location desired
 * @param {LOCATION_TYPE} type type of location to look up
 * @param {Date} date chosen for search
 */
function revealLocationInfo(id, type, date=new Date()) {
  let query;
  let s;
  if (type == LOCATION_TYPE.PUBLIC_ART) {
    query = getPublicArt;
    s = 'getPublicArt';
  } else if (type == LOCATION_TYPE.EVENT) {
    query = getEvent;
    s = 'getEvent';
  } else {
    throw new TypeError('To get info for a location, it must have a type of: ' +
                        Object.keys(LOCATION_TYPE).toString());
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
          date={date}
        />,
        sidebar,
    );
    openSidebar();
  }).catch((err) => console.error('Problem generating info window:', err));
}

/**
 * @param  {google.maps.Map} map a google map
 * @param  {google.maps.LatLngBounds} bounds of map
 * @param {Date} chosenDate to look up events for
 * @param {boolean} isPublic if the user wants events from a public entity
 * @param {boolean} isPrivate if the user wants events from a private entity
 * @returns {Promise<Array<google.maps.Marker>>} a promise containing the events in map markers
 */
export function getEventWithinMap(
    map, bounds, chosenDate, isPublic, isPrivate) {
  // TODO: take in variables object instead of asking for ispublic, chosendate, etc..
  const dateString = chosenDate.toISOString().substring(0, 10);
  const newMarkers = [];

  const query = gql(getEventWithinBoundingBox);
  const variables = {
    // is_public: isPublic,
    // is_private: isPrivate,
    search: {
      // TODO: date variables.
      start_date: dateString,
      end_date: dateString,
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
    for (const event of getEventWithinBoundingBox) {
      const location = event.location;
      location.lng = location.lon;

      const marker = new google.maps.Marker({
        position: location, map: map, title: event.name,
      });
      marker.addListener('click', () => {
        if (prevMarker) prevMarker.setLabel(null);

        // console.log('querying event:', event.name, event.id);
        revealLocationInfo(event.id, LOCATION_TYPE.EVENT, chosenDate);
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
 * @param  {google.maps.LatLngBounds} bounds of map
 * @param  {string} filter an optional filter term
 * @param  {boolean} isPermanent search for permanent installations or not
 * @returns {Promise<Array>} Promise containing the markers for each location
 */
export function getPublicArtWithinMap(map, bounds, filter, isPermanent) {
  const newMarkers = [];

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

        // console.log('querying public art:', publicArt.name, publicArt.id);
        revealLocationInfo(publicArt.id, LOCATION_TYPE.PUBLIC_ART);
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
