/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPublicArtWithinBoundingBox = `query GetPublicArtWithinBoundingBox(
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
export const getEventWithinBoundingBox = `query GetEventWithinBoundingBox($search: BoundingBoxInput!) {
  getEventWithinBoundingBox(search: $search) {
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
export const getReported = `query GetReported($id: ID!) {
  getReported(id: $id) {
    id
    art_id
    reason
    reason_continued
  }
}
`;
export const listReporteds = `query ListReporteds(
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
export const getPublicArt = `query GetPublicArt($id: ID!) {
  getPublicArt(id: $id) {
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
export const listPublicArts = `query ListPublicArts(
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
      photos
      permanent
      date_range {
        start
        end
      }
      owner
    }
    nextToken
  }
}
`;
export const searchPublicArts = `query SearchPublicArts(
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
      photos
      permanent
      date_range {
        start
        end
      }
      owner
    }
    nextToken
    total
  }
}
`;
export const getEvent = `query GetEvent($id: ID!) {
  getEvent(id: $id) {
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
export const listEvents = `query ListEvents(
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
    nextToken
  }
}
`;
export const searchEvents = `query SearchEvents(
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
    nextToken
    total
  }
}
`;
