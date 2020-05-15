import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
// eslint-disable-next-line camelcase
import aws_config from '../aws-exports';
import {Auth, Hub} from 'aws-amplify';

/** Creates two AppSync clients: One with Cognito, one with an API key.
 */
export function createClient() {
  // Users must be logged in to mutate our data
  window.cognitoClient = new AWSAppSyncClient({
    url: aws_config.aws_appsync_graphqlEndpoint,
    region: aws_config.aws_appsync_region,
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () => (
        await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    // TODO: needed to avoid bug with expired credentials (I think?)
    // See: https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/453#issuecomment-520246437
    // May have something to do with our parameters.json change in commit 88fc4
    disableOffline: true,
    offlineConfig: {
      keyPrefix: 'mutations',
    },
  });

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

Hub.listen('auth', (data) => {
  const loginButtonUI = document.getElementById('login-button-ui');
  const loginButtonText = document.getElementById('login-button-text');
  let text = '';
  if (data.payload.event == 'signIn') text = 'Log out';
  else if (data.payload.event == 'signOut') text = 'Log in';

  if (data.payload.event == 'signIn' || data.payload.event == 'signOut') {
    loginButtonUI.title = text;
    loginButtonText.innerHTML = text;
  }
});
