import React, {useState, useEffect} from 'react';

const FeedbackForm = () => {
  const [display, toggleDisplay] = useState(false);
  const [email, changeEmail] = useState('');
  const [username, changeUsername] = useState('');
  const [content, changeContent] = useState('');

  useEffect(() => window.scrollTo(0, document.scrollingElement.scrollHeight), [display]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('form submitted', email, username, content);
  };

  const renderButton = () => {
    const turnOn = 'Feedback';
    const turnOff = 'Hide Feedback Form';
    return (
      <button id='feedback-form-toggle' onClick={() => toggleDisplay(!display)}>
        {display ? turnOff : turnOn}
      </button>
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <label>Email:
          <input
            type='text'
            id='email-input'
            name='email'
            placeholder='optional'
            onChange={changeEmail}
            value={email}
          />
        </label>
        <label>Reddit Username:
          <input
            type='text'
            id='username-input'
            name='username'
            placeholder='optional'
            onChange={changeUsername}
            value={username}
          />
        </label>
        <label>Feedback:
          <textarea
            id='content-input'
            name='content'
            onChange={changeContent}
            value={content}
          />
        </label>
      </form>
    );
  };

  return (
    <div id="feedback-form">
      {renderButton()}
      {display ? renderForm() : null}
    </div>
  );
};

export default FeedbackForm;
