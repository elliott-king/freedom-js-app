/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const flagLocation = `mutation FlagLocation($input: FlagLocationInput!) {
  flagLocation(input: $input) {
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
export const changePublicArtType = `mutation ChangePublicArtType($input: ChangePublicArtTypeInput!) {
  changePublicArtType(input: $input) {
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
