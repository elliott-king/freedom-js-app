import AWSAppSyncClient from 'aws-appsync';
// eslint-disable-next-line camelcase
import aws_config from '../aws-exports';
import {Auth} from 'aws-amplify';


/**
 * @returns {AWSAppSyncClient} A client with the user's auth for our api
 */
export function createClient() {
  return new AWSAppSyncClient({
    url: aws_config.aws_appsync_graphqlEndpoint,
    region: aws_config.aws_appsync_region,
    auth: {
      type: aws_config.aws_appsync_authenticationType,
      jwtToken: async () => (
        await Auth.currentSession()).getAccessToken().getJwtToken(),
    },
  });
}
