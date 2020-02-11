import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
// eslint-disable-next-line camelcase
import aws_config from '../aws-exports';

/** Creates two AppSync clients: One with Cognito, one with an API key.
 */
export function createClient() {

  // Users do not need to be logged in to query our data
  window.keyClient = new AWSAppSyncClient({
    url: aws_config.aws_appsync_graphqlEndpoint,
    region: aws_config.aws_appsync_region,
    auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: aws_config.aws_appsync_apiKey,
    },
    disableOffline: true,
    offlineConfig: {
      keyPrefix: 'queries',
    },
  });
}
