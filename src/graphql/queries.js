/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPublicArtWithinBoundingBox = /* GraphQL */ `
  query GetPublicArtWithinBoundingBox(
    $search: BoundingBoxInput!
    $permanent: Boolean!
    $type: PublicArtType
  ) {
    getPublicArtWithinBoundingBox(
      search: $search
      permanent: $permanent
      type: $type
    ) {
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
export const getEventWithinBoundingBox = /* GraphQL */ `
  query GetEventWithinBoundingBox(
    $search: BoundingBoxInput!
    $is_public: Boolean!
    $is_private: Boolean!
  ) {
    getEventWithinBoundingBox(
      search: $search
      is_public: $is_public
      is_private: $is_private
    ) {
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
export const getReported = /* GraphQL */ `
  query GetReported($id: ID!) {
    getReported(id: $id) {
      id
      art_id
      reason
      reason_continued
    }
  }
`;
export const listReporteds = /* GraphQL */ `
  query ListReporteds(
    $filter: ModelReportedFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReporteds(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        art_id
        reason
        reason_continued
      }
      nextToken
    }
  }
`;
export const getPublicArt = /* GraphQL */ `
  query GetPublicArt($id: ID!) {
    getPublicArt(id: $id) {
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
export const listPublicArts = /* GraphQL */ `
  query ListPublicArts(
    $filter: ModelPublicArtFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicArts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const searchPublicArts = /* GraphQL */ `
  query SearchPublicArts(
    $filter: SearchablePublicArtFilterInput
    $sort: SearchablePublicArtSortInput
    $limit: Int
    $nextToken: String
  ) {
    searchPublicArts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          nextToken
        }
      }
      nextToken
      total
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
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
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const searchEvents = /* GraphQL */ `
  query SearchEvents(
    $filter: SearchableEventFilterInput
    $sort: SearchableEventSortInput
    $limit: Int
    $nextToken: String
  ) {
    searchEvents(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          nextToken
        }
      }
      nextToken
      total
    }
  }
`;
export const getPhoto = /* GraphQL */ `
  query GetPhoto($id: ID!) {
    getPhoto(id: $id) {
      id
      location_id
      url
      user_id
      owner
    }
  }
`;
export const listPhotos = /* GraphQL */ `
  query ListPhotos(
    $filter: ModelPhotoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotos(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
`;
