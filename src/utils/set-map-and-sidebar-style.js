import React from 'react';
import ReactDOM from 'react-dom';

var smallWindowRatios = {
    sidebar: "35%",
    map: "65%"
};
var largeWindowRatios = {
    sidebar: "25%",
    map: "75%"
};
var maxSize = "100%";
var minSize = "0";

// TODO: center map on clicked location (either new location or a pin)
export default function setMapAndSidebarStyle(sidebarIsPopulated) {

    // Detecting screen size with CSS. 
    // https://stackoverflow.com/questions/31162606
    let smallWindow = window.matchMedia('screen and (max-width: 700px)').matches;

    var sidebarDiv = document.getElementById("sidebar");
    var mapDiv = document.getElementById("map");

    if (!sidebarIsPopulated) {
        mapDiv.style.height = maxSize;
        mapDiv.style.width = maxSize;
        mapDiv.style['margin-left'] = minSize;

        ReactDOM.unmountComponentAtNode(sidebarDiv);
        sidebarDiv.style.height = minSize;
        sidebarDiv.style.width = minSize;
        return;
    }

    // For a smaller window, we would like the sidebar above the map.
    if(smallWindow) {
        sidebarDiv.style.width = maxSize;
        sidebarDiv.style.height = smallWindowRatios.sidebar;
        sidebarDiv.style.position = "relative";
        sidebarDiv.style.top = "0";
        sidebarDiv.style.overflow = "auto";

        mapDiv.style['margin-left'] = "0";
        mapDiv.style.height = smallWindowRatios.map;

    } else { // For a large window, the sidebar will be on the left.
        sidebarDiv.style.position = "fixed";
        sidebarDiv.style.height = maxSize;
        sidebarDiv.style.width = largeWindowRatios.sidebar;
        sidebarDiv.style.overflow = "auto";

        mapDiv.style.height = maxSize;
        mapDiv.style['margin-left'] = largeWindowRatios.sidebar;

    }
}