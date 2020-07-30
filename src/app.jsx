import '../css/style.css';

import {createClient} from './utils/aws-client-handler';
import React from 'react';
import ReactDOM from 'react-dom';

import Amplify from 'aws-amplify';
// eslint-disable-next-line camelcase
import aws_config from './aws-exports';

import EventContainer from './nomap/event-container.jsx';

// Required setup for AWS Amplify utilities (API, S3, Auth, etc..)
Amplify.configure(aws_config);

// We create global auth clients so anything can call gql queries
console.log('creating client...');
createClient();

ReactDOM.render(<EventContainer />, document.getElementById('root'));
