import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
// eslint-disable-next-line camelcase
import aws_config from '../aws-exports';
import {Auth} from 'aws-amplify';

/** Creates two AppSync clients: One with Cognito, one with an API key.
 */
export function createClient() {
  window.cognitoClient = new AWSAppSyncClient({
    url: aws_config.aws_appsync_graphqlEndpoint,
    region: aws_config.aws_appsync_region,
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () => (
        await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    offlineConfig: {
      keyPrefix: 'mutations',
    },
  });

  window.keyClient = new AWSAppSyncClient({
    url: aws_config.aws_appsync_graphqlEndpoint,
    region: aws_config.aws_appsync_region,
    auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: aws_config.aws_appsync_apiKey,
    },
    offlineConfig: {
      keyPrefix: 'queries',
    },
  });
}
