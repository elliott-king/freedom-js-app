import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import aws_config from '../aws-exports';
import { Auth } from 'aws-amplify';


export function createClient() {
    Auth.currentCredentials().then((creds) => console.log('creds:', creds));
    // console.log('creds:', Auth.currentCredentials());
    // async () => global.AWS.config.credentials = await Auth.currentCredentials();
    return new AWSAppSyncClient({
        url: aws_config.aws_appsync_graphqlEndpoint,
        region: aws_config.aws_appsync_region,
        auth: {
            type: aws_config.aws_appsync_authenticationType,
            jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),

            // TODO: is this necessary?
            // credentials: () => Auth.currentCredentials(),
        },
        // TODO: optional for anything without a file
        complexObjectCredentials: () => Auth.currentCredentials()
    });
}