/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addPhoto = `mutation AddPhoto($location_id: String!, $url: AWSURL!) {
  addPhoto(location_id: $location_id, url: $url) {
    id
    location {
      lat
      lon
    }
    name
    description
    type
    photos
    permanent
    date_range {
      start
      end
    }
    owner
  }
}
`;
export const createPublicArt = `mutation CreatePublicArt($input: CreatePublicArtInput!) {
  createPublicArt(input: $input) {
    id
    location {
      lat
      lon
    }
    name
    description
    type
    photos
    permanent
    date_range {
      start
      end
    }
    owner
  }
}
`;
export const updatePublicArt = `mutation UpdatePublicArt($input: UpdatePublicArtInput!) {
  updatePublicArt(input: $input) {
    id
    location {
      lat
      lon
    }
    name
    description
    type
    photos
    permanent
    date_range {
      start
      end
    }
    owner
  }
}
`;
export const deletePublicArt = `mutation DeletePublicArt($input: DeletePublicArtInput!) {
  deletePublicArt(input: $input) {
    id
    location {
      lat
      lon
    }
    name
    description
    type
    photos
    permanent
    date_range {
      start
      end
    }
    owner
  }
}
`;
export const createEvent = `mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    id
    location {
      lat
      lon
    }
    name
    description
    types
    host
    source
    website
    photos
    dates
    times
    location_description
    rsvp
    owner
  }
}
`;
export const updateEvent = `mutation UpdateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    id
    location {
      lat
      lon
    }
    name
    description
    types
    host
    source
    website
    photos
    dates
    times
    location_description
    rsvp
    owner
  }
}
`;
export const deleteEvent = `mutation DeleteEvent($input: DeleteEventInput!) {
  deleteEvent(input: $input) {
    id
    location {
      lat
      lon
    }
    name
    description
    types
    host
    source
    website
    photos
    dates
    times
    location_description
    rsvp
    owner
  }
}
`;
export const createReported = `mutation CreateReported($input: CreateReportedInput!) {
  createReported(input: $input) {
    id
    art_id
    reason
    reason_continued
  }
}
`;
export const updateReported = `mutation UpdateReported($input: UpdateReportedInput!) {
  updateReported(input: $input) {
    id
    art_id
    reason
    reason_continued
  }
}
`;
export const deleteReported = `mutation DeleteReported($input: DeleteReportedInput!) {
  deleteReported(input: $input) {
    id
    art_id
    reason
    reason_continued
  }
}
`;
