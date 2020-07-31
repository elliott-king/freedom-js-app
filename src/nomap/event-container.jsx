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
      // testing locations, eliminate need for query
      // locations: [{"id":"44b0c634-d569-404e-b836-c456f0579c90","location":{"lat":40.7677306,"lon":-73.9712496,"__typename":"Location"},"name":"Arsenal Gallery: Alice Momm: The Gleaner's Song","description":"The Gleaner’s Song is a collection of mixed-media works, words, and photographs by artist Alice Momm, inspired by her daily, immersive walks in Central Park. The materials and impressions gathered on these rambles become the seeds of artworks that pay tribute to the ragged beauty of found objects in nature and honor the quiet dramas unfolding in unexpected places. While often humorous, the artworks reflect a deep concern for our environment and an appreciation of the interconnectedness of all living beings. This solo exhibition is Momm's love song to Central Park and an invitation to find wonder and joy in New York City’s parks.\nThis event is FREE and open to the public.\nPlease note: The Arsenal Gallery will be closed on Monday, May 25, 2020.\nImages: Alice Momm, Untitled from Gleaner's Song, 2017, bark, gouache, wire, paper; Central Park, Reaching Tree, 2019, digital photograph","types":["art"],"host":"NYC Parks","source":"https://www.nycgovparks.org","website":"https://www.nycgovparks.org/events/2020/03/13/arsenal-gallery-alice-momm-the-gleaners-song","dates":["2020-03-17","2020-04-23","2020-04-01","2020-06-03","2020-05-26","2020-04-06","2020-03-18","2020-03-20","2020-04-29","2020-05-14","2020-03-25","2020-04-15","2020-04-13","2020-04-24","2020-05-21","2020-05-25","2020-04-21","2020-04-14","2020-05-01","2020-05-18","2020-03-24","2020-04-02","2020-03-13","2020-04-22","2020-05-13","2020-04-27","2020-04-30","2020-05-11","2020-05-28","2020-03-27","2020-03-30","2020-04-03","2020-03-31","2020-05-07","2020-05-20","2020-04-10","2020-03-19","2020-05-12","2020-05-04","2020-04-07","2020-05-29","2020-05-05","2020-04-09","2020-05-08","2020-05-06","2020-05-22","2020-05-27","2020-03-16","2020-04-17","2020-03-23","2020-06-04","2020-06-02","2020-04-16","2020-04-08","2020-06-01","2020-04-28","2020-03-26","2020-05-15","2020-05-19","2020-04-20"],"times":["09:00:00","17:00:00"],"location_description":"Arsenal (In Central Park), Manhattan","rsvp":false,"owner":null,"photos":{"items":[{"id":"91e3d3cb-a526-4a4b-abe3-af7faaa44e97","location_id":"44b0c634-d569-404e-b836-c456f0579c90","url":"https://www.nycgovparks.org/common_images/events/5e4ebba7a01fa.jpg","user_id":null,"owner":null,"__typename":"Photo"}],"nextToken":null,"__typename":"ModelPhotoConnection"},"__typename":"Event"},{"id":"4b20745e-5a8a-4754-983e-a42089727d04","location":{"lat":40.73297448933016,"lon":-73.99758536794967,"__typename":"Location"},"name":"The Intermission Mission","description":"The Intermission Mission, in support of The Actors Fund, premiered on Friday, March 20. You can watch exclusive videos of very special at-home performances from members of the Broadway community on TodayTix’s Instagram Account. In an effort to support each other artistically, emotionally, and financially, TodayTix gently encourages you, as you enjoy these performances, to consider paying an “admission” in the form of a donation to The Actors Fund. Your donation, however big or small, will be immeasurably helpful in this time of need.","types":["comedy"],"host":"Actors Fund","source":null,"website":"https://actorsfund.org/performances-and-events/intermission-mission","dates":["2020-05-08","2020-05-15","2020-05-22","2020-05-29"],"times":["18:00"],"location_description":null,"rsvp":false,"owner":"a542a066-dbd3-4782-baf2-2c17b6b07df6","photos":{"items":[{"id":"e1186f51-c82f-4e69-9960-3f06e88cd7b0","location_id":"4b20745e-5a8a-4754-983e-a42089727d04","url":"https://actorsfund.org/sites/default/files/styles/event_feature/public/images/event/feature/IntermissionMission_0.jpg?itok=hxTDbjrc","user_id":null,"owner":"a542a066-dbd3-4782-baf2-2c17b6b07df6","__typename":"Photo"}],"nextToken":null,"__typename":"ModelPhotoConnection"},"__typename":"Event"},{"id":"c9767134-5898-420e-82ff-97eb9541136b","location":{"lat":40.7830603,"lon":-73.9712488,"__typename":"Location"},"name":"Soul Saver Sessions","description":"Soul Saver Sessions with Jonathan E. Jacobs, aka the Vintage DJ. Every weekday from 5:30-6:30p EST, Jonathan E. Jacobs aka the Vintage DJ will be hosting a live vinyl listening session via his Instagram page. https://www.instagram.com/jonathanejacobs/ or @jonathaneJacobs and Facebook page www.facebook.com/thevintagedj. All are welcome.","types":["music"],"host":"The Vintage DJ","source":"http://www.nonsensenyc.com/","website":"https://www.instagram.com/jonathanejacobs/","dates":["2020-05-04","2020-05-05","2020-05-06","2020-05-07","2020-05-08","2020-05-11","2020-05-12","2020-05-13","2020-05-14","2020-05-15","2020-05-18","2020-05-19","2020-05-20","2020-05-21","2020-05-22"],"times":["17:30:00"],"location_description":"Manhattan","rsvp":false,"owner":null,"photos":{"items":[],"nextToken":null,"__typename":"ModelPhotoConnection"},"__typename":"Event"},{"id":"664627ec-3a13-444c-8104-b668a306ef06","location":{"lat":40.73916503776948,"lon":-73.99771070228266,"__typename":"Location"},"name":"NYCB's Digital Spring Season","description":"From April 21 through May 29, New York City Ballet presents digital streams of two ballets a week, along with a full slate of other online programming, including new podcast episodes and livestreamed movement classes for all ages, to coincide with the dates of our now-cancelled Spring 2020 performances at Lincoln Center.","types":["music"],"host":"New York City Ballet","source":null,"website":"https://www.nycballet.com/Season-Tickets/Digital-Spring-Season.aspx","dates":["2020-05-19","2020-05-22","2020-05-26","2020-05-29"],"times":["20:00"],"location_description":null,"rsvp":false,"owner":"a542a066-dbd3-4782-baf2-2c17b6b07df6","photos":{"items":[{"id":"4b851052-4b36-4929-b95b-bcb50f12ebf1","location_id":"664627ec-3a13-444c-8104-b668a306ef06","url":"https://www.nycballet.com/NYCB/media/NYCBMediaLibrary/Images/New%20Homepage/FY20-spring-mira-promo.jpg?ext=.jpg","user_id":null,"owner":"a542a066-dbd3-4782-baf2-2c17b6b07df6","__typename":"Photo"}],"nextToken":null,"__typename":"ModelPhotoConnection"},"__typename":"Event"},{"id":"387ba6ea-198a-4b81-9b96-0a09c89319ad","location":{"lat":40.717235872476245,"lon":-74.00110401093532,"__typename":"Location"},"name":"Sarah Stiles: Squirrel Heart - Joe's Pub Live! From the Archives ","description":"Sarah Stiles  stars opposite Kevin James  in the new Netflix comedy THE CREW. She is also one of the stars in the critically acclaimed EPIX Original Series GET SHORTY. She is a two time Tony nominee for her role as \"Sandy\" in the Broadway production of TOOTSIE and her performance as “Jessica” in HAND TO GOD. She is currently recurring on Showtime’s BILLIONS and voiced the character “Spinel” in STEVEN UNIVERSE: THE MOVIE. ","types":["music"],"host":"The Public","source":null,"website":"https://publictheater.org/productions/joes-pub/2020/j/sarah-stiles-squirrel-heart---joes-pub-live-from-the-archives/","dates":["2020-05-22"],"times":["20:00"],"location_description":null,"rsvp":false,"owner":"a542a066-dbd3-4782-baf2-2c17b6b07df6","photos":{"items":[],"nextToken":null,"__typename":"ModelPhotoConnection"},"__typename":"Event"},{"id":"39cac6c4-1b3a-4e8e-87c6-8005c9cfb45f","location":{"lat":40.73297448933016,"lon":-73.99758536794967,"__typename":"Location"},"name":"test1","description":"desc","types":["art"],"host":"h","source":null,"website":"http://example","dates":["2020-05-22"],"times":["12:00"],"location_description":null,"rsvp":false,"owner":"a542a066-dbd3-4782-baf2-2c17b6b07df6","photos":{"items":[],"nextToken":null,"__typename":"ModelPhotoConnection"},"__typename":"Event"}],
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
      is_public: true,
      is_private: true,
      family: false,
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
