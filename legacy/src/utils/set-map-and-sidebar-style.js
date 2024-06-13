/* eslint-disable react/jsx-key */

import React from 'react';
import ReactDOM from 'react-dom';
import {Authenticator, ConfirmSignUp, Greetings, SignIn, SignUp}
  from 'aws-amplify-react';

const smallWindowRatios = {
  sidebar: '100%',
  map: '0%',
};
const largeWindowRatios = {
  sidebar: '25%',
  map: '75%',
};
const maxSize = '100%';
const minSize = '0';
const divTypeEnum = Object.freeze({
  SIDEBAR: 1,
  LOGIN: 2,
});

let historyPushed = false;

/** Setup large over-screen div
 *
 * @returns {Element} the now open div
 */
export function openLargeScreen() {
  closeSidebar();
  prepHistory();
  // TODO: change to 'large'
  addHistory(divTypeEnum.LOGIN);
  const loginDiv = document.getElementById('login');
  const mapDiv = document.getElementById('map');

  loginDiv.style.width = maxSize;
  loginDiv.style.height = maxSize;
  loginDiv.style.position = 'relative';
  loginDiv.style.top = '0';
  loginDiv.style.overflow = 'auto';

  mapDiv.style['margin-left'] = '0';
  mapDiv.style.height = smallWindowRatios.map;
  return loginDiv;
}

/** Setup login div */
export function openLogin() {
  const loginDiv = openLargeScreen();

  ReactDOM.render(
      (<React.Fragment>
        <Authenticator
          includeGreetings={true}
          usernameAttributes='email'
          authenticatorComponents={[
            <SignIn/>,
            <SignUp/>,
            <ConfirmSignUp/>,
            <Greetings
              inGreeting="Welcome"
            />,
          ]}
        />
        <button type="button" onClick={() => closeLogin()}
          className="close">Cancel</button>
      </React.Fragment>),
      loginDiv,
  );
}

/** Remove login div and history */
export function closeLogin() {
  prepHistory();
  const loginDiv = document.getElementById('login');
  const mapDiv = document.getElementById('map');
  ReactDOM.unmountComponentAtNode(loginDiv);

  mapDiv.style.height = maxSize;
  mapDiv.style.width = maxSize;
  mapDiv.style['margin-left'] = minSize;

  loginDiv.style.height = minSize;
  loginDiv.style.width = minSize;
  return;
}

/** Pops history state if sidebar/login div already exist.
 * This allows user to open the sidebar twice without changing the url.
 */
function prepHistory() {
  // TODO: Hacky, should be redesigned at some point.
  if (historyPushed) {
    historyPushed = false;
    history.back();
  }
}

/** Updates history and enables 'back' button
 *
 * @param {divTypeEnum} divType the div we are updating
 */
function addHistory(divType) {
  // Ensure that we always return to root. Corrects the use of the 'forward' button.
  // If 'forwarded' into a state with url of /with-sidebar, returns to root instead.
  history.replaceState(null, null, window.location.origin);

  // Using history api to change effect of back button
  // Automatically works with sidebar 'close' buttons.
  // Guide: http://diveintohtml5.info/history.html
  // API: https://html.spec.whatwg.org/multipage/history.html
  history.pushState(null, null, window.location.href + 'with-sidebar');
  historyPushed = true;
  window.addEventListener('popstate', (event) => {
    historyPushed = false;
    if (divType == divTypeEnum.LOGIN) closeLogin();
    else if (divType == divTypeEnum.SIDEBAR) closeSidebar();
    else throw new TypeError('Need the type of div to add to history.');
  });
}

// TODO: center map on clicked location (either new location or a pin)
/** Setup sidebar div */
export function openSidebar() {
  prepHistory();
  closeLogin();
  addHistory(divTypeEnum.SIDEBAR);
  const sidebarDiv = document.getElementById('sidebar');
  const mapDiv = document.getElementById('map');

  // Detecting screen size with CSS.
  // https://stackoverflow.com/questions/31162606
  const smallWindow = window.matchMedia(
      'screen and (max-width: 700px)').matches;

  // For a smaller window, we would like the sidebar to consume the viewport.
  if (smallWindow) {
    sidebarDiv.style.width = maxSize;
    sidebarDiv.style.height = smallWindowRatios.sidebar;
    sidebarDiv.style.position = 'relative';
    sidebarDiv.style.top = '0';
    sidebarDiv.style.overflow = 'auto';

    mapDiv.style['margin-left'] = '0';
    mapDiv.style.height = smallWindowRatios.map;
  } else {
    // For a large window, the sidebar will be on the left.
    sidebarDiv.style.position = 'fixed';
    sidebarDiv.style.height = maxSize;
    sidebarDiv.style.width = largeWindowRatios.sidebar;
    sidebarDiv.style.overflow = 'auto';

    mapDiv.style.height = maxSize;
    mapDiv.style.width = largeWindowRatios.map;
    mapDiv.style['margin-left'] = largeWindowRatios.sidebar;
  }
}

/** Remove sidebar div and history */
export function closeSidebar() {
  prepHistory();
  const sidebarDiv = document.getElementById('sidebar');
  const mapDiv = document.getElementById('map');

  if (historyPushed) {
    historyPushed = false;
    history.back();
  }

  mapDiv.style.height = maxSize;
  mapDiv.style.width = maxSize;
  mapDiv.style['margin-left'] = minSize;

  sidebarDiv.style.height = minSize;
  sidebarDiv.style.width = minSize;
  return;
}
