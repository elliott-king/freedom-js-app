import gql from 'graphql-tag';
import path from 'path';
import {v4 as uuid} from 'uuid';
import {Storage} from 'aws-amplify';

// eslint-disable-next-line camelcase
import aws_config from '../aws-exports';

import {addPhoto} from '../graphql/mutations';

/**
 * @param  {object} imgFile The image to upload
 * @param  {string} locationId Location for this image
 * @param  {string} description An optional description
 * @returns {Promise} The result of adding to S3
 */
export function uploadImage(imgFile, locationId, description) {
  const photoId = uuid();
  // TODO: Eventually will want more metadata with photo (like user_id)
  // We should make photo its own model in the schema

  // First, upload file to AWS S3
  return Storage.put(photoId + '.png', imgFile, {
    contentType: 'image/png',
  }).then( (result) => {
    // NOTE: This S3 bucket is publically viewable.
    const imgUrl = 'https://' + path.join(
        aws_config.aws_user_files_s3_bucket + '.s3.amazonaws.com', 'public', result.key);

    // Second, we put the photo's url in dynamodb.
    return window.client.mutate({
      mutation: gql(addPhoto),
      variables: {
        location_id: locationId,
        url: imgUrl,
      },
    });
  }).catch((err) => console.error('Error uploading image:', err));
}
