/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePublicArt = /* GraphQL */ `
  subscription OnCreatePublicArt($owner: String!) {
    onCreatePublicArt(owner: $owner) {
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
export const onUpdatePublicArt = /* GraphQL */ `
  subscription OnUpdatePublicArt($owner: String!) {
    onUpdatePublicArt(owner: $owner) {
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
export const onDeletePublicArt = /* GraphQL */ `
  subscription OnDeletePublicArt($owner: String!) {
    onDeletePublicArt(owner: $owner) {
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
export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent($owner: String!) {
    onCreateEvent(owner: $owner) {
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
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent($owner: String!) {
    onUpdateEvent(owner: $owner) {
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
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent($owner: String!) {
    onDeleteEvent(owner: $owner) {
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
export const onCreateReported = /* GraphQL */ `
  subscription OnCreateReported {
    onCreateReported {
      id
      art_id
      reason
      reason_continued
    }
  }
`;
export const onUpdateReported = /* GraphQL */ `
  subscription OnUpdateReported {
    onUpdateReported {
      id
      art_id
      reason
      reason_continued
    }
  }
`;
export const onDeleteReported = /* GraphQL */ `
  subscription OnDeleteReported {
    onDeleteReported {
      id
      art_id
      reason
      reason_continued
    }
  }
`;
export const onCreatePhoto = /* GraphQL */ `
  subscription OnCreatePhoto($owner: String!) {
    onCreatePhoto(owner: $owner) {
      id
      location_id
      url
      user_id
      owner
    }
  }
`;
export const onUpdatePhoto = /* GraphQL */ `
  subscription OnUpdatePhoto($owner: String!) {
    onUpdatePhoto(owner: $owner) {
      id
      location_id
      url
      user_id
      owner
    }
  }
`;
export const onDeletePhoto = /* GraphQL */ `
  subscription OnDeletePhoto($owner: String!) {
    onDeletePhoto(owner: $owner) {
      id
      location_id
      url
      user_id
      owner
    }
  }
`;
