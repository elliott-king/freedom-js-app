import React from 'react';
import gql from 'graphql-tag';

import {getEventWithinBoundingBox, getEvent} from '../graphql/queries';
import Filter from './filter.jsx';
import EventTileContainer from './event-tiles.jsx';

export default class EventContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
    };
    this.search = this.search.bind(this);
  }

  search(filters) {
    window.keyClient.query({
      query: gql(getEventWithinBoundingBox),
      variables: filters,
      // TODO: prevents browser-side caching, not necessary in long term
      fetchPolicy: 'network-only',
    }).then(({data: {getEventWithinBoundingBox}}) => {
      this.setState({locations: []});
      for (const event of getEventWithinBoundingBox) {
        window.keyClient.query({
          query: gql(getEvent),
          variables: {id: event.id},
          fetchPolicy: 'network-only',
        }).then(({data: {getEvent}}) => {
          this.setState({locations: this.state.locations.concat(getEvent)});
        }).catch((err) => {
          console.error('Error fetching event with id:', event.id, '/nError:', err);
        });
      }
    }).catch((err) => console.error('Error searching for events:', err));
  }

  componentDidMount() {
    const variables = {
      is_public: true, // fixme: add toggle in search
      is_private: true, // fixme: add toggle in search
      search: {
        start_date: new Date().toISOString().substring(0, 10),
        end_date: new Date().toISOString().substring(0, 10),
        // 'Bounds' are just appx the bounds of nyc
        // Hard-coding these so we can use our already-written code
        // It may be worth writing a new query
        top_right_gps: {
          lat: 40.843890,
          lon: -73.747242,
        },
        bottom_left_gps: {
          lat: 40.493938,
          lon: -74.278223,
        },
      },
    };
    this.search(variables);
  }

  render() {
    return (
      <React.Fragment>
        <Filter
          search={this.search}
        />
        <EventTileContainer
          locations={this.state.locations}
        />
      </React.Fragment>
    );
  }
}
