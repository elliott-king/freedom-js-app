import gql from 'graphql-tag';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { Storage, Auth } from 'aws-amplify';

import aws_config from '../aws-exports';

import { addPhoto } from '../graphql/mutations';

export function uploadImage(img_file, location_id, description) {
    let photo_id = uuid();
    console.log('file to upload:', img_file);

    // First, upload file to AWS S3
    return Storage.put(photo_id + '.png', img_file, {
        contentType: 'image/png',
    // TODO: make this more complex, and make photo its own model in the schema (for more metadata like user_id)
    }).then( (result) => {
        console.log("Uploaded image to S3.");
        console.log(location_id);
        // This S3 bucket is publically viewable.
        let img_url = "https://" + path.join(aws_config.aws_user_files_s3_bucket + ".s3.amazonaws.com", "public", result.key);
        // Second, we put the photo's url in dynamodb.
        return window.client.mutate({
            mutation: gql(addPhoto),
            variables: {
                location_id: location_id,
                url: img_url
            }
        });
    })
    .catch(err => console.error("Error uploading image:", err));
}