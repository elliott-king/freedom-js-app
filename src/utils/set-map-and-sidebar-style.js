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

let historyPushed = false;

// TODO: center map on clicked location (either new location or a pin)
/**
 * @param  {boolean} sidebarIsPopulated The sidebar contains information
 */
export default function setMapAndSidebarStyle(sidebarIsPopulated) {
  // Pops history state if sidebar already exists.
  // This allows user to open the sidebar twice without changing the url.
  // TODO: Hacky, should be redesigned at some point.
  if (historyPushed) {
    historyPushed = false;
    history.back();
  }

  // Detecting screen size with CSS.
  // https://stackoverflow.com/questions/31162606
  const smallWindow = window.matchMedia(
      'screen and (max-width: 700px)').matches;

  const sidebarDiv = document.getElementById('sidebar');
  const mapDiv = document.getElementById('map');

  if (!sidebarIsPopulated) {
    mapDiv.style.height = maxSize;
    mapDiv.style.width = maxSize;
    mapDiv.style['margin-left'] = minSize;

    sidebarDiv.style.height = minSize;
    sidebarDiv.style.width = minSize;
    return;
  }

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
    setMapAndSidebarStyle(false);
  });

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
