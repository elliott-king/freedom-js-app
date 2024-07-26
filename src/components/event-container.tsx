import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

import type { Schema } from "../../amplify/data/resource";
import type { MapBounds } from "../types";

// const loader = new Loader({
//   apiKey: import.meta.env.VITE_FREEDOM_LOCAL_MAPS_KEY,
//   version: "weekly",
// });

// const initMap = () => {
//   loader
//   .importLibrary('maps')
//   .then(({Map}) => {
//     new Map(document.getElementById("map"), {
//       center: {},
//       zoom: 9,
//     });
//   })
//   .catch((e) => {
//     // do something
// });
// };

const DEBUG_GQL_VARIABLES = {
  // is_public: true, // fixme: add toggle in search
  // is_private: true, // fixme: add toggle in search
  // fixme: add date in search
  // fixme: add limit(10)
  search: {
    start_date: new Date().toISOString().substring(0, 10),
    end_date: new Date().toISOString().substring(0, 10),
    // 'Bounds' are just appx the bounds of nyc
    // Hard-coding these so we can use our already-written code
    // It may be worth writing a new query
    top_right_gps: {
      lat: 40.84389,
      lon: -73.747242,
    },
    bottom_left_gps: {
      lat: 40.493938,
      lon: -74.278223,
    },
  },
};

/** Container to search & display events */
export const EventContainer = ({
  bounds,
  onBoundsChange,
}: {
  bounds: MapBounds;
  onBoundsChange: (b: MapBounds) => void;
}) => {
  // const [events, setEvents] = useState<Array<Schema["Event"]["type"]>>([]);
  // const [locations, setLocations] = useState<Array<string>>([]);

  // const search = (filters: any) => {
  // fixme: fix typing and call
  // gqlquery.then((data) =>
  // gets generic event .forEach(event => get specific event)

  //   window.keyClient.query({
  //     query: gql(getEventWithinBoundingBox),
  //     variables: filters,
  //     // TODO: prevents browser-side caching, not necessary in long term
  //     fetchPolicy: 'network-only',
  //   }).then(({data: {getEventWithinBoundingBox}}) => {
  //     this.setState({locations: []});
  //     for (const event of getEventWithinBoundingBox) {
  //       window.keyClient.query({
  //         query: gql(getEvent),
  //         variables: {id: event.id},
  //         fetchPolicy: 'network-only',
  //       }).then(({data: {getEvent}}) => {
  //         this.setState({locations: this.state.locations.concat(getEvent)});
  //       }).catch((err) => {
  //         console.error('Error fetching event with id:', event.id, '/nError:', err);
  //       });
  //     }
  //   }).catch((err) => console.error('Error searching for events:', err));
  // }
  //   return;
  // };

  // useEffect(() => {
  //   search(DEBUG_GQL_VARIABLES);
  // }, []);

  return (
    <div id="event-container">
      <h1>Event Container</h1>
      {/* fixme: more dynamic/responsive width/height */}
      <div style={{ width: "100%", height: "350px" }}>
        <APIProvider
          apiKey={import.meta.env.VITE_FREEDOM_LOCAL_MAPS_KEY}
          version="weekly"
          onLoad={() => console.log("Maps API has loaded.")}
        >
          <Map
            // fixme: prevent from being larger than bounding box
            defaultBounds={bounds}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              onBoundsChange(ev.detail.bounds)
            }
          />
        </APIProvider>
      </div>
    </div>
  );
};
