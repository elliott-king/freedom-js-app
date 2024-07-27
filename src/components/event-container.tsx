import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Pin,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import type { V6Client } from "@aws-amplify/api-graphql";

import { NYC_GPS_BOUNDING_BOX } from "../constants";

import type { Schema } from "../../amplify/data/resource";

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

// https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#0
type Poi = {
  key: string;
  name: string;
  location: google.maps.LatLngLiteral;
};

const MapContainer = ({
  events,
  onBoundsChange,
}: {
  events: Array<Schema["Event"]["type"]>;
  onBoundsChange: (b: google.maps.LatLngBoundsLiteral) => void;
}) => {
  const pinLocations: Array<Poi> = events
    .map((e) => ({
      key: e.id,
      name: e.name,
      // NOTE: awkward syntax: TS having trouble if I put the filter first
      location: e.location
        ? {
            lat: e.location.lat,
            lng: e.location.lon,
          }
        : null,
    }))
    .filter((p) => p.location !== null);

  const pins = pinLocations.map((poi) => (
    <AdvancedMarker
      key={poi.key}
      position={poi.location}
      onClick={() => console.log("clicked pin", poi.key, poi.name)}
    >
      <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
    </AdvancedMarker>
  ));

  // fixme: more dynamic/responsive width/height
  return (
    <div style={{ width: "100%", height: "350px" }}>
      <APIProvider
        apiKey={import.meta.env.VITE_FREEDOM_LOCAL_MAPS_KEY}
        version="weekly"
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          // fixme: prevent from being larger than bounding box
          defaultBounds={NYC_GPS_BOUNDING_BOX}
          mapId={import.meta.env.VITE_FREEDOM_MAP_ID}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            onBoundsChange(ev.detail.bounds)
          }
        >
          {pins}
        </Map>
      </APIProvider>
    </div>
  );
};

/** Ignore close-together inputs and run fn once all inputs have been submitted */
const debounce = <A = unknown, R = void>(
  fn: (args: A) => R,
  timeout = 300
): [(args: A) => Promise<R>, () => void] => {
  // https://dev.to/bwca/create-a-debounce-function-from-scratch-in-typescript-560m
  let timer: NodeJS.Timeout;
  const debouncedFunc = (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        resolve(fn(args));
      }, timeout);
    });

  const teardown = () => clearTimeout(timer);
  return [debouncedFunc, teardown];
};

/** Container to search & display events */
export const EventContainer = ({ client }: { client: V6Client<Schema> }) => {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [events, setEvents] = useState<Array<Schema["Event"]["type"]>>([]);

  const setEventsFromBounds = (bounds: google.maps.LatLngBoundsLiteral) => {
    client.queries
      .searchEventWithinBoundingBox({
        top: bounds.north,
        left: bounds.west,
        bottom: bounds.south,
        right: bounds.east,
      })
      .then((res) => {
        // client.queries.getEvents().then((res) => {
        if (res.data) {
          const events = res.data
            .filter((e) => !!e)
            .map((e) =>
              // res.data does not have ts Event type
              ({
                name: e.name,
                host: e.host,
                description: e.description,
                locationDescription: e.locationDescription,
                rsvp: e.rsvp,
                gov: e.gov,
                source: e.source,
                website: e.website,
                types: e.types || [],
                location: e.location,
                dates: e.dates || [],
                times: e.times || [],
                photos: e.photos,
                id: e.id,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
              })
            );
          setEvents(events);
        }
      });
  };

  useEffect(() => {
    // fixme: accept date range & limit (10)
    setEventsFromBounds(NYC_GPS_BOUNDING_BOX);
  }, []);

  const handleBoundsChange = (bounds: google.maps.LatLngBoundsLiteral) => {
    // Debounce these events: they can happen often when user is zooming
    console.log("bounds change donotsubmit", bounds);
    const [fn, _] = debounce(setEventsFromBounds);
    fn(bounds);
  };

  return (
    <div id="event-container">
      <h1>Event Container</h1>
      <MapContainer events={events} onBoundsChange={handleBoundsChange} />
    </div>
  );
};
