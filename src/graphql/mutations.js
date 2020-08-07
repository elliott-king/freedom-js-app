/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPublicArt = /* GraphQL */ `
  mutation CreatePublicArt($input: CreatePublicArtInput!) {
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
export const updatePublicArt = /* GraphQL */ `
  mutation UpdatePublicArt($input: UpdatePublicArtInput!) {
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
export const deletePublicArt = /* GraphQL */ `
  mutation DeletePublicArt($input: DeletePublicArtInput!) {
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
export const createEvent = /* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      location {
        lat
        lon
      }
      name
      description
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
      location {
        lat
        lon
      }
      name
      description
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent($input: DeleteEventInput!) {
    deleteEvent(input: $input) {
      id
      location {
        lat
        lon
      }
      name
      description
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
export const createReported = /* GraphQL */ `
  mutation CreateReported($input: CreateReportedInput!) {
    createReported(input: $input) {
      id
      art_id
      reason
      reason_continued
    }
  }
`;
export const updateReported = /* GraphQL */ `
  mutation UpdateReported($input: UpdateReportedInput!) {
    updateReported(input: $input) {
      id
      art_id
      reason
      reason_continued
    }
  }
`;
export const deleteReported = /* GraphQL */ `
  mutation DeleteReported($input: DeleteReportedInput!) {
    deleteReported(input: $input) {
      id
      art_id
      reason
      reason_continued
    }
  }
`;
export const createPhoto = /* GraphQL */ `
  mutation CreatePhoto($input: CreatePhotoInput!) {
    createPhoto(input: $input) {
      id
      location_id
      url
      user_id
      owner
    }
  }
`;
export const updatePhoto = /* GraphQL */ `
  mutation UpdatePhoto($input: UpdatePhotoInput!) {
    updatePhoto(input: $input) {
      id
      location_id
      url
      user_id
      owner
    }
  }
`;
export const deletePhoto = /* GraphQL */ `
  mutation DeletePhoto($input: DeletePhotoInput!) {
    deletePhoto(input: $input) {
      id
      location_id
      url
      user_id
      owner
    }
  }
`;
