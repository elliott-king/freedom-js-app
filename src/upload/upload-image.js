import gql from 'graphql-tag';
import { v4 as uuid } from 'uuid';
import { Storage, Auth } from 'aws-amplify';

import { createPhoto } from '../graphql/mutations';

export function uploadImage(img_file, location_id, description, client) {
    let photo_id = uuid();
    console.log('file to upload:', img_file);

    // First, upload file to AWS S3
    Storage.put(photo_id + '.png', img_file, {
        contentType: 'image/png',
    }).then( () => Auth.currentCredentials())
    .then( identityId => {
        // Then, upload metadata to AppSync/DynamoDB
        client.mutate({
            mutation: gql(createPhoto),
            variables: {
                input: {
                    id: photo_id,
                    location_id: location_id,
                    description: description,
                    filename: photo_id + '.png',
                    user_id: identityId._identityId,
                }
            }
        })
        .then(() => {
            console.log("Successfully uploaded new image for", location_id, "by user", identityId._identityId);
        })
        .catch(err => console.error("Error with uploading image metadata to db.", err));
    })
    .catch(err => console.error("Error uploading image to s3.", err));
}