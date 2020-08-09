import '../css/style.css';

import {initMap} from './utils/map-utils';
import {createClient} from './utils/aws-client-handler';

import Amplify from 'aws-amplify';
// eslint-disable-next-line camelcase
import aws_config from './aws-exports';

// Required setup for AWS Amplify utilities (API, S3, Auth, etc..)
Amplify.configure(aws_config);

// We create global auth clients so anything can call gql queries
console.log('creating client...');
createClient();

window.map = initMap();
