import '../css/style.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';

import {getPublicArtWithinMap} from './utils/info-window.jsx';
import { createClient } from './utils/client-handler';

import {Authenticator} from 'aws-amplify-react';
import Amplify from 'aws-amplify';
import aws_config from './aws-exports';

// Needed to avoid error w/ async fns
// https://stackoverflow.com/questions/28976748/regeneratorruntime-is-not-defined
import 'babel-polyfill';

var map;
var markers = [];
const client = createClient();

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
                    <button className="public-art-button"
                    title="Click to find nearby public art."
                    onClick={() => searchWithinMapBounds(this.state.filter)}>
                        Public Art Search
                    </button>
                    <div className="public-art-dropdown">
                        <Select
                            menuPlacement="top"
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
            <Authenticator>
                <PublicArtUi/>
            </Authenticator>
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
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(publicArtControlDiv);
    ReactDOM.render(
        <PublicArtControlDiv />,
        publicArtControlDiv
    );

    map.addListener('click', function(event) {
        var latLng = event.latLng;
        var lat = latLng.lat();
        var lng = latLng.lng();

        newPublicArtUpload(lat, lng);
    });

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

// TODO: can we just do Auth.configure(aws_config)?
Amplify.configure(aws_config);
initMap();

function handleLocationError(browserHasGeolocation, pos) {
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: the geolocation service has failed.' : 
                          'Error: your browser does not support geolocation.');
    infoWindow.open(map);
}

function searchWithinMapBounds(filter) {

    getPublicArtWithinMap(map, filter, client, function(new_markers) {
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

class PublicArtUploadForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageFile: "",
            name: "",
            description: "",
            selectedOption: ""
        };
        this.optionChange = this.optionChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.imageChange = this.imageChange.bind(this);
        this.descriptionChange = this.descriptionChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault(); // KTHXWHAT?

        // TODO: need a check on mandatory fields. 
        // Could just rely on server throwing an error.
        console.log("Submit location:", this.state);

        // Delete a div from the DOM.
        // https://stackoverflow.com/questions/8404797/
        var f = document.getElementById("public-art-upload-form");
        f.parentNode.removeChild(f);
    }
    handleClose(event) {
        event.preventDefault();
        var f = document.getElementById("public-art-upload-form");
        f.parentNode.removeChild(f);
    }

    optionChange(selectedOption) {
        this.setState({selectedOption: selectedOption});
    }
    nameChange(event) {
        this.setState({name: event.target.value});
    }

    descriptionChange(event) {
        this.setState({description: event.target.value});
    }
    imageChange(event) {
        this.setState({imageFile: event.target.value});
    }

    // center div horizontally & vertically
    // https://stackoverflow.com/questions/22658141

    render() {
        return (
            <div 
            id="public-art-upload-form"
            className="public-art-upload-form"
            >
                <form onSubmit={this.handleSubmit}>
                    <h3>Upload new public art.</h3>
                    <input type="text"
                        placeholder="Name"
                        name="name"
                        value={this.state.name}
                        onChange={this.nameChange}
                    />
                    <Select
                        // TODO: this should not include 'all'
                        options={options}
                        onChange={this.optionChange}
                    />
                    <div>
                        <p>Latitude: {this.props.lat}</p>
                        <p>Longitude: {this.props.lng}</p>
                    </div>
                    <div><h4>Choose image for location</h4>
                        <input 
                            type="file"
                            value={this.state.imageFile}
                            onChange={this.imageChange}
                        />
                    </div>
                    <div>
                        <input type="text"
                            placeholder="Description"
                            name="description"
                            value={this.state.description}
                            onChange={this.descriptionChange}
                        />
                    </div>
                    <button type="submit" className="btn">Upload location</button>
                    <button type="button" onClick={this.handleClose} className="close">Close</button>
                </form>
            </div>
        )
    }
}

// TODO: just take in a latLng
// TODO: upload items to S3
function newPublicArtUpload(lat, lng) {
    console.debug("New click event at:", lat, lng);

    var publicArtUploadDiv = document.createElement('div');
    document.getElementById('root').appendChild(publicArtUploadDiv);

    // TODO: needs an 'x' exit button.
    ReactDOM.render(
        <PublicArtUploadForm
            lat={lat}
            lng={lng}
        />,
        publicArtUploadDiv
    );

}