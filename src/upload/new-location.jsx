/* eslint-disable react/jsx-key */
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Select from 'react-select';
import DatePicker from 'react-date-picker';
import gql from 'graphql-tag';
import {v4 as uuid} from 'uuid';
import {withAuthenticator, ConfirmSignUp, Greetings, SignIn, SignUp}
  from 'aws-amplify-react';

import {uploadImage} from './upload-image';
import {createPublicArt} from '../graphql/mutations';
import setMapAndSidebarStyle from '../utils/set-map-and-sidebar-style';
import {updateMarkers} from '../utils/markers-utils';
import {centerMap} from '../utils/map-utils';
import {SIMPLE_OPTIONS} from '../utils/constants';

class PublicArtUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      selectedOption: '',
      permanent: true,
      start: new Date(),
      end: new Date(),
      lat: this.props.lat,
      lon: this.props.lng,
    };

    // To upload images in React, we use the file API.
    // https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
    this.imageInput = React.createRef();

    this.checkboxChange = this.checkboxChange.bind(this);
    this.optionChange = this.optionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.descriptionChange = this.descriptionChange.bind(this);
    this.userLocation = this.userLocation.bind(this);
  }

  componentDidMount() {
    // Allow other pieces to change the selected location.
    window.updateNewLocationFields = (lat, lon) => {
      this.setState({lat: lat, lon: lon});
    };
  }

  handleSubmit(event) {
    event.preventDefault(); // KTHXWHAT?

    // Only create new location if there is an image file.
    if (this.imageInput.current.files.length > 0 &&
      this.state.name &&
      this.selectedOption) {
      const locationId = uuid();
      const imgFile = this.imageInput.current.files[0];

      const input = {
        id: locationId,
        name: this.state.name,
        location: {
          lat: this.state.lat,
          lon: this.state.lon,
        },
        description: (this.state.description ? this.state.description : undefined),
        permanent: this.state.permanent,
        // TODO: we should add a default type.
        type: this.state.selectedOption.value,
      };
      if (!this.state.permanent) {
        input.date_range = {
          start: this.state.start.toISOString().substr(0, 10),
          end: this.state.end.toISOString().substr(0, 10),
        };
      }

      window.client.mutate({
        mutation: gql(createPublicArt),
        variables: {input: input},
      }).then((response) => {
        console.log('Uploaded new location', this.state.name, 'to dynamodb.');
        return uploadImage(imgFile, locationId, '');
      }).then((response) => {
        console.log('Successfully uploaded image for new location', this.state.name);
        // Finally, remove both the sidebar and the marker.
        setMapAndSidebarStyle(false);
        updateMarkers([]);
      }).catch((err) => {
        console.error('Error uploading new location:', err);
        throw err;
      });
    } else if (!this.state.selectedOption) {
      window.alert('Please choose the type of public art');
      console.warn('Please choose the type of public art');
    } else if (!this.state.name) {
      console.warn('New location needs a name.');
    } else {
      console.warn('Need image to create new location.');
    }
  }

  optionChange(selectedOption) {
    this.setState({selectedOption: selectedOption});
  }
  nameChange(event) {
    this.setState({name: event.target.value});
  }
  checkboxChange(event) {
    this.setState({permanent: event.target.checked});
  }

  descriptionChange(event) {
    this.setState({description: event.target.value});
  }

  // Date picker should only show if 'permanent' box is unchecked.
  renderDateSelectors() {
    if (!this.state.permanent) {
      return (
        <React.Fragment>
          <DatePicker
            onChange={(val) => this.setState({start: val})}
            value={this.state.start}
          />
          <DatePicker
            onChange={(val) => this.setState({end: val})}
            value={this.state.end}
          />
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  userLocation(event) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=> {
        this.setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

        const newLocationReplacementMarker = new google.maps.Marker({
          position: {lng: position.coords.longitude, lat: position.coords.latitude},
          map: window.map,
          title: 'New location',
          label: 'N',
        });
        updateMarkers([newLocationReplacementMarker]);
        centerMap();
      }, function(err) {
        console.warn('Error: geolocation service has failed:', err);
      });
    } else {
      console.warn('Browser does not handle geolocation');
    }
  }

  // center div horizontally & vertically
  // https://stackoverflow.com/questions/22658141
  render() {
    return (
      <div id="new-public-art-upload" className="public-art-upload-form-container">
        <form onSubmit={this.handleSubmit} className="public-art-upload-form">
          <h1>New Public Art</h1>
          <h4 className="new-public-art-location">
            Location: {this.state.lat.toFixed(2)}, {this.state.lon.toFixed(2)}
          </h4>
          <button type="button"
            className="new-public-art-set-location"
            onClick={this.userLocation}>
            Use my current location
          </button>
          <div className="new-public-art-name">
            <p>Name</p>
            <input className = "new-public-art-input"
              type="text"
              placeholder="Name"
              name="name"
              value={this.state.name}
              onChange={this.nameChange}
            />
          </div>
          <div className="new-public-art-description">
            <p>Description</p>
            <input className="new-public-art-input"
              type="text"
              placeholder="Optional"
              name="description"
              value={this.state.description}
              onChange={this.descriptionChange}
            />
          </div>
          <Select
            options={SIMPLE_OPTIONS}
            onChange={this.optionChange}
          />
          <input
            type="checkbox"
            label="Permanent piece"
            checked={this.state.permanent}
            onChange={this.checkboxChange}
          />
          <div>Permanent piece</div>
          {this.renderDateSelectors()}
          <div className="new-public-art-image">
            <h4>Choose image for location</h4>
            <input
              type="file"
              accept="image/png"
              ref={this.imageInput}
            />
          </div>
          <button type="submit" className="btn">Upload new location</button>
        </form>
      </div>
    );
  }
}
PublicArtUploadForm.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

// TODO: just take in a latLng
/**
 * @param  {number} lat latitude for new public art
 * @param  {number} lng longitude
 */
export function newPublicArtUpload(lat, lng) {
  console.debug('New click event at:', lat, lng);

  const currentLocationUpload = document.getElementById('new-public-art-upload');

  if (currentLocationUpload) {
    window.updateNewLocationFields(lat, lng);
  } else {
    const sidebar = document.getElementById('sidebar');
    ReactDOM.unmountComponentAtNode(sidebar);

    const handleClose = (event) => {
      setMapAndSidebarStyle(false);
    };

    const uploadForm = () => {
      return (
        <PublicArtUploadForm
          lat={lat}
          lng={lng}
        />
      );
    };

    const UploadFormWithAuthenticator = withAuthenticator(uploadForm, {
      includeGreetings: true,
      authenticatorComponents: [
        <SignIn/>,
        <SignUp/>,
        <ConfirmSignUp/>,
        <Greetings
          inGreeting="Welcome"
        />,
      ],
      // TODO: get rid of phone number somehow?
      usernameAttributes: 'email',
    });

    ReactDOM.render(
        (<React.Fragment>
          <UploadFormWithAuthenticator/>
          <button type="button" onClick={handleClose}
            className="close">Close</button>
        </React.Fragment>),
        sidebar
    );
  }

  setMapAndSidebarStyle(true);
}
