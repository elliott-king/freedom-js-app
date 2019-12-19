import gql from 'graphql-tag';
import path from 'path';
import {v4 as uuid} from 'uuid';
import {Storage, Auth} from 'aws-amplify';

// eslint-disable-next-line camelcase
import aws_config from '../aws-exports';
import {createPhoto} from '../graphql/mutations';

/**
 * @param  {object} imgFile The image to upload
 * @param  {string} locationId Location for this image
 * @returns {Promise} promise indicating upload completion
 */
export function uploadImage(imgFile, locationId) {
  // NOTE: this process sometimes has issues with auth/iam/user pools.
  // If we get an error "missing credentials in config" and
  // [debug] log "Failed to load credentials":
  // https://stackoverflow.com/questions/44043289/

  const photoId = uuid();

  // TODO: if any fail, we should revert everything previuos on the promise tree
  return Auth.currentAuthenticatedUser().then((user) => {
    Storage.put(photoId + '.png', imgFile, {contentType: 'image/png'})
        .then((s3Result) => {
          // NOTE: This S3 bucket is publically viewable.
          const input = {
            url: 'https://' + path.join(aws_config.aws_user_files_s3_bucket +
                '.s3.amazonaws.com', 'public', s3Result.key),
            id: uuid,
            user_id: user.username,
            location_id: locationId,
          };
          window.cognitoClient.mutate({
            mutation: gql(createPhoto),
            variables: {input: input},
          }).catch((err) => console.log('Error with gql in image upload:', err));
        }).catch((err) => console.log('Cannot upload image to S3:', err));
  }).catch((err) => console.log('Authetication error in image upload:', err));
}
