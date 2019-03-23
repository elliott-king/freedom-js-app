import '../css/style.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';

import {GetPublicArtWithinMap} from './utils/client-handler';

/*
MAJOR TODOS:
- move everything to new file (except maybe initMap())
*/


var map;
var markers = [];

const options = [
    { value: 'all', label: 'All'},
    { value: 'public-art', label: 'Public Art'},
    { value: 'sculpture', label: 'Sculpture'},
    { value: 'monument', label: 'Monument'}
];

class PublicArtUi extends React.Component {
    // Inherits internal values from child PublicArtDropdownMenu
    // https://stackoverflow.com/questions/35537229
    
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state = {filter: 'all'};
    }

    handleChange(selectedOption){
        this.setState({filter: selectedOption.value});
    }
    render() {
        return (
            <div className="public-art-ui">
                <React.Fragment>
                    <div className="public-art-text" 
                    title='Click to find nearby public art.'
                    onClick={() => getPublicArtWithinMap(this.state.filter)}>
                        Public Art Search
                    </div>
                    <div className="public-art-dropdown">
                        <Select
                            options={options}
                            isClearable={false}
                            defaultValue={options[0]}
                            onChange={this.handleChange}
                        />
                    </div>
                </React.Fragment>
            </div>
        )
    }
}

class PublicArtControlDiv extends React.Component {

    render() {
        return (
        <div className="public-art-control" index="1">
            <PublicArtUi/>
        </div>
        )
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -75},
        zoom: 15
    });

    // Taken from:
    // https://github.com/tomchentw/react-google-maps/issues/818
    var publicArtControlDiv = document.createElement('div');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(publicArtControlDiv);
    ReactDOM.render(
        <PublicArtControlDiv/>,
        publicArtControlDiv
    )

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log("Your position: ", pos.toString());
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser does not support HTML5 geolocation
        handleLocationError(false, map.getCenter());
    }
}
initMap();

function handleLocationError(browserHasGeolocation, pos) {
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: the geolocation service has failed.' : 
                          'Error: your browser does not support geolocation.');
    infoWindow.open(map);
}

function getPublicArtWithinMap(filter) {

    GetPublicArtWithinMap(map, filter, function(new_markers) {
        deleteMarkers(markers);
        markers = new_markers
        showMarkers(markers);
    });
}
       
function setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function showMarkers(markers) {
    setMapOnAll(map, markers);
}
function deleteMarkers(markers) {
    setMapOnAll(null, markers);
}