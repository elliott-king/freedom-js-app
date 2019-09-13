// eslint-disable
// this is an auto generated file. This will be overwritten

export const getPublicArtWithinBoundingBox = `query GetPublicArtWithinBoundingBox(
  $top_right_gps: LocationInput!
  $bottom_left_gps: LocationInput!
  $limit: Int
  $type: String
) {
  getPublicArtWithinBoundingBox(
    top_right_gps: $top_right_gps
    bottom_left_gps: $bottom_left_gps
    limit: $limit
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
  }
}
`;
export const whoAmI = `query WhoAmI {
  whoAmI
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
    }
    nextToken
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
export const searchPublicArts = `query SearchPublicArts(
  $filter: SearchablePublicArtFilterInput
  $sort: SearchablePublicArtSortInput
  $limit: Int
  $nextToken: Int
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
    }
    nextToken
  }
}
`;
