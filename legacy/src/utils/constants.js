export const LOCATION_TYPE = Object.freeze({
  NONE: 0,
  PUBLIC_ART: 1,
  EVENT: 2,
});

export const SIMPLE_ART_OPTIONS = [
  {value: 'sculpture', label: 'Sculpture'},
  {value: 'mural', label: 'Mural'},
];

const SHARED_REPORTS = [
  {value: 'wrong-photo', label: 'Photo incorrect'},
  {value: 'place-dne', label: 'Location does not exist'},
  {value: 'nsfw', label: 'Location has inappropriate or offensive content'},
  {value: 'bad-date-range', label: 'Dates are incorrect.'},
];

export const PUBLIC_ART_REPORTS = [
  {value: 'not-public-art', label: 'Location is not public art'},
  {value: 'wrong-location-type', label: 'Mislabeled location type'},
].concat(SHARED_REPORTS);

export const EVENT_REPORTS = [
  {value: 'not-event', label: 'Not an event'},
  {value: 'not-free', label: 'Not free'},
].concat(SHARED_REPORTS);
