/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
    permanent
    date_range {
      start
      end
    }
    owner
    photos {
      items {
        id
        location_id
        url
        user_id
        owner
      }
      nextToken
    }
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
    permanent
    date_range {
      start
      end
    }
    owner
    photos {
      items {
        id
        location_id
        url
        user_id
        owner
      }
      nextToken
    }
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
    permanent
    date_range {
      start
      end
    }
    owner
    photos {
      items {
        id
        location_id
        url
        user_id
        owner
      }
      nextToken
    }
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
    dates
    times
    location_description
    rsvp
    owner
    photos {
      items {
        id
        location_id
        url
        user_id
        owner
      }
      nextToken
    }
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
    dates
    times
    location_description
    rsvp
    owner
    photos {
      items {
        id
        location_id
        url
        user_id
        owner
      }
      nextToken
    }
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
    dates
    times
    location_description
    rsvp
    owner
    photos {
      items {
        id
        location_id
        url
        user_id
        owner
      }
      nextToken
    }
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
export const createPhoto = `mutation CreatePhoto($input: CreatePhotoInput!) {
  createPhoto(input: $input) {
    id
    location_id
    url
    user_id
    owner
  }
}
`;
export const updatePhoto = `mutation UpdatePhoto($input: UpdatePhotoInput!) {
  updatePhoto(input: $input) {
    id
    location_id
    url
    user_id
    owner
  }
}
`;
export const deletePhoto = `mutation DeletePhoto($input: DeletePhotoInput!) {
  deletePhoto(input: $input) {
    id
    location_id
    url
    user_id
    owner
  }
}
`;
