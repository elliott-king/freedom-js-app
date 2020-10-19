import React from 'react';

import EventContainer from './nomap/event-container.jsx';
import FeedbackForm from './upload/feedback.jsx';

const Root = () => {
  return (
    <React.Fragment>
      <EventContainer />
      <FeedbackForm />
    </React.Fragment>
  );
};

export default Root;
