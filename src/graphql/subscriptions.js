/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePublicArt = `subscription OnCreatePublicArt {
  onCreatePublicArt {
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
export const onUpdatePublicArt = `subscription OnUpdatePublicArt {
  onUpdatePublicArt {
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
export const onDeletePublicArt = `subscription OnDeletePublicArt {
  onDeletePublicArt {
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
export const onCreateEvent = `subscription OnCreateEvent {
  onCreateEvent {
    id
    location {
      lat
      lon
    }
    name
    description
    type
    host
    website
    photos
    datetime
    location_description
  }
}
`;
export const onUpdateEvent = `subscription OnUpdateEvent {
  onUpdateEvent {
    id
    location {
      lat
      lon
    }
    name
    description
    type
    host
    website
    photos
    datetime
    location_description
  }
}
`;
export const onDeleteEvent = `subscription OnDeleteEvent {
  onDeleteEvent {
    id
    location {
      lat
      lon
    }
    name
    description
    type
    host
    website
    photos
    datetime
    location_description
  }
}
`;
export const onCreateReported = `subscription OnCreateReported {
  onCreateReported {
    id
    art_id
    reason
    reason_continued
  }
}
`;
export const onUpdateReported = `subscription OnUpdateReported {
  onUpdateReported {
    id
    art_id
    reason
    reason_continued
  }
}
`;
export const onDeleteReported = `subscription OnDeleteReported {
  onDeleteReported {
    id
    art_id
    reason
    reason_continued
  }
}
`;
