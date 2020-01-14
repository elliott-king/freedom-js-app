export const locationType = Object.freeze({
  NONE: 0,
  PUBLIC_ART: 1,
  EVENT: 2,
});

export const SIMPLE_ART_OPTIONS = [
  {value: 'sculpture', label: 'Sculpture'},
  {value: 'mural', label: 'Mural'},
];

const additionalArtOptions = [
  {value: 'all', label: 'Any type'},
];

export const EVENT_TYPES = [
  {value: 'advocacy', label: 'Advocacy'},
  {value: 'art', label: 'Art'},
  {value: 'athletics', label: 'Athletics'},
  {value: 'comedy', label: 'Comedy'},
  {value: 'dance', label: 'Dance'},
  {value: 'diy', label: 'DIY'},
  {value: 'education', label: 'Education'},
  {value: 'family', label: 'Family'},
  {value: 'film', label: 'Film'},
  {value: 'food', label: 'Food'},
  {value: 'history', label: 'History'},
  {value: 'holiday', label: 'Holiday'},
  {value: 'literature', label: 'Literature'},
  {value: 'lgbtq', label: 'LGBTQ'},
  {value: 'music', label: 'Music'},
  {value: 'nature', label: 'Nature'},
  {value: 'new_york', label: 'New York'},
  {value: 'philosophy', label: 'Philosophy'},
  {value: 'science', label: 'Science'},
  {value: 'shopping', label: 'Shopping'},
  {value: 'theater', label: 'Theater'},
];

export const ALL_OPTIONS = additionalArtOptions.concat(SIMPLE_ART_OPTIONS);
