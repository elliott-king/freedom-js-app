import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import aws_config from '../aws-exports';
import { Auth } from 'aws-amplify';


export function createClient() {
    return new AWSAppSyncClient({
        url: aws_config.aws_appsync_graphqlEndpoint,
        region: aws_config.aws_appsync_region,
        auth: {
            type: aws_config.aws_appsync_authenticationType,
            jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
        },
    });
}