export const locationType = Object.freeze({
  PUBLIC_ART: 1,
  EVENT: 2,
});

export const SIMPLE_OPTIONS = [
  {value: 'sculpture', label: 'Sculpture'},
  {value: 'mural', label: 'Mural'},
];

const additionalOptions = [
  {value: 'all', label: 'Any type'},
];

export const ALL_OPTIONS = additionalOptions.concat(SIMPLE_OPTIONS);
