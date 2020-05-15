/* eslint-disable react/jsx-key */
/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Auth} from 'aws-amplify';

import Select from 'react-select';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import gql from 'graphql-tag';
import {v4 as uuid} from 'uuid';

import {uploadImage} from './upload-image';
import {createPublicArt, createEvent} from '../graphql/mutations';
import {openSidebar, closeSidebar} from '../utils/set-map-and-sidebar-style';
import {updateMarkers} from '../utils/markers-utils';
import {SIMPLE_ART_OPTIONS, LOCATION_TYPE, EVENT_TYPES} from '../utils/constants';

class PublicArtUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // shared
      name: '',
      description: '',
      artType: '', // TODO: rename 'artType'

      // public art
      permanent: true,
      start: new Date(),
      end: new Date(),

      // event
      // NOTE: we will ignore the 'source' field for user-supplied content
      eventTypes: [],
      host: '',
      website: '',
      dates: [new Date()],
      times: [],
      locationDescription: '',
      rsvp: false,
      // TODO: none of the arrays are implemented as multiple select (currently only provide one)
    };

    // To upload images in React, we use the file API.
    // https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
    this.imageInput = React.createRef();
    this.uploadHandler = this.uploadHandler.bind(this);
  }

  componentDidMount() {
    // Allow other pieces to change the selected location.
    window.updateNewLocationFields = (lat, lon) => {
      this.setState({lat: lat, lon: lon});
    };
  }

  uploadHandler(event) {
    event.preventDefault(); // KTHXWHAT?

    if (this.state.name) {
      const hasFieldsPublicArt = (
        Boolean(this.state.artType) && this.imageInput.current.files.length > 0);
      const hasFieldsEvent = this.state.eventTypes.length > 0 && this.state.website;
      if ((this.props.type == LOCATION_TYPE.PUBLIC_ART && hasFieldsPublicArt) ||
        (this.props.type == LOCATION_TYPE.EVENT && hasFieldsEvent)) {
        let gqlMutation = undefined;
        const locationId = uuid();

        const input = {
          id: locationId,
          name: this.state.name,
          location: {
            lat: this.props.lat,
            lon: this.props.lng,
          },
          description: (this.state.description ?
            this.state.description : undefined),
        };

        if (this.props.type == LOCATION_TYPE.PUBLIC_ART) {
          gqlMutation = createPublicArt;
          input.permanent = this.state.permanent;
          // TODO: we should add a default type.
          input.type = this.state.artType;

          if (!this.state.permanent) {
            input.date_range = {
              start: this.state.start.toISOString().substr(0, 10),
              end: this.state.end.toISOString().substr(0, 10),
            };
          }
        } else if (this.props.type == LOCATION_TYPE.EVENT) {
          gqlMutation = createEvent;
          input.rsvp = this.state.rsvp;
          input.times = this.state.times;
          input.dates = this.state.dates.map((d) => d.toISOString().substr(0, 10));
          input.types = this.state.eventTypes;
          if (!this.state.website.startsWith('http')) {
            input.website = 'http://' + this.state.website;
          } else input.website = this.state.website;
          if (this.state.host) input.host = this.state.host;
          // TODO: base lat lng location on the description, if it exists.
          if (this.state.locationDescription) {
            input.location_description = this.state.locationDescription;
          }
        } else {
          // Should never be here, but lets be safe
          throw new Error('Location does not have a type of \'event\' or \'public art\'');
        }

        window.cognitoClient.mutate({
          mutation: gql(gqlMutation), variables: {input: input}})
            .then((createLocationResponse) => {
              if (this.imageInput.current.files.length > 0) {
                const imgFile = this.imageInput.current.files[0];
                return uploadImage(imgFile, locationId);
              } else {
                return 'No image to upload.';
              }
            })
            .then((uploadPhotoResponse) => {
              // Finally, remove both the sidebar and the marker.
              closeSidebar();
              updateMarkers([]);
            }).catch((err) => console.log('Cannot create new location:', err));
      } else if (!this.state.artType && !(this.state.eventTypes.length > 0)) {
        window.alert('Please choose one or more tags for the location.');
        console.warn('Please choose one or more tags for the location.');
      } else if (this.props.type == LOCATION_TYPE.EVENT) {
        window.alert('Please include a website for this event.');
        console.warn('Please include a website for this event.');
      } else if (!this.imageInput.current.files.length > 0) {
        window.alert('Need image to create a new public art.');
        console.warn('Need image to create a new public art.');
      }
    } else {
      window.alert('New location needs a name.');
      console.warn('New location needs a name.');
    }
  }

  renderTitle() {
    if (this.props.type == LOCATION_TYPE.PUBLIC_ART) return (<h1>New Public Art</h1>);
    else return (<h1>New Event</h1>);
  }

  renderTypeSelector() {
    if (this.props.type == LOCATION_TYPE.PUBLIC_ART) {
      return (
        <Select
          options={SIMPLE_ART_OPTIONS}
          onChange={(selectedOption) => this.setState({artType: selectedOption.value})}
        />
      );
    } else if (this.props.type == LOCATION_TYPE.EVENT) {
      return (
        <Select
          options={EVENT_TYPES}
          onChange={
            (selectedOption) => this.setState({eventTypes: [selectedOption.value]})}
        />
      );
    } else return null;
  }

  renderCheckbox() {
    const text = (this.props.type == LOCATION_TYPE.PUBLIC_ART ?
      'Permanent piece' : 'RSVP Necessary');
    const isChecked = (this.props.type == LOCATION_TYPE.PUBLIC_ART ?
      this.state.permanent : this.state.rsvp);
    const checkboxChange = (event) => {
      if (this.props.type == LOCATION_TYPE.PUBLIC_ART) {
        this.setState({permanent: event.target.checked});
      } else {
        this.setState({rsvp: event.target.checked});
      }
    };

    return (
      <React.Fragment>
        <input
          type="checkbox"
          label={text}
          checked={isChecked}
          onChange={checkboxChange}
        />
        <div>{text}</div>
      </React.Fragment>
    );
  }

  renderDateSelectors() {
    if (this.props.type == LOCATION_TYPE.PUBLIC_ART && !this.state.permanent) {
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
    } else if (this.props.type == LOCATION_TYPE.EVENT) {
      // TODO: time picker looks awful. User should only be able to type
      return (
        <React.Fragment>
          <DatePicker
            onChange={(val) => this.setState({dates: [val]})}
            value={this.state.dates[0]}
          />
          <TimePicker
            disableClock={true}
            onChange={(val) => this.setState({times: [val]})}
            value={this.state.times[0]}
          />
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  renderSimpleEventFields() {
    if (this.props.type == LOCATION_TYPE.EVENT) {
      return (
        <React.Fragment>
          <div className="new-location-input">
            <p>Website</p>
            <input
              type="text"
              placeholder="URL"
              name="website"
              value={this.state.website}
              onChange={(event) => this.setState({website: event.target.value})}
            />
          </div>
          <div className="new-location-input">
            <p>Host</p>
            <input
              type="text"
              placeholder="Host/Venue"
              name="host"
              value={this.state.host}
              onChange={(event) => this.setState({host: event.target.value})}
            />
          </div>
          <div className="new-location-input">
            <p>Address</p>
            <input
              type="text"
              placeholder="Address (optional)"
              name="location-description"
              value={this.state.locationDescription}
              onChange={(event) =>
                this.setState({locationDescription: event.target.value})}
            />
          </div>
        </React.Fragment>
      );
    } else return null;
  }

  // center div horizontally & vertically
  // https://stackoverflow.com/questions/22658141
  render() {
    return (
      <div id="new-location-upload" className="location-upload-form-container">
        <form onSubmit={this.uploadHandler} className="location-upload-form">
          {this.renderTitle()}
          <h4 className="new-location-latlng">
            Location: {this.props.lat.toFixed(3)}, {this.props.lng.toFixed(3)}
          </h4>
          <p>Click the map to change location.</p>
          <div className="new-location-input">
            <p>Name</p>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={this.state.name}
              onChange={(event) => this.setState({name: event.target.value})}
              // onChange={this.nameChange}
            />
          </div>
          <div className="new-location-input">
            <p>Description</p>
            <input
              type="text"
              placeholder="Optional"
              name="description"
              value={this.state.description}
              onChange={(event) => this.setState({description: event.target.value})}
            />
          </div>
          {this.renderSimpleEventFields()}
          {this.renderTypeSelector()}
          {this.renderCheckbox()}
          {this.renderDateSelectors()}
          <div className="new-location-image">
            <h4>Choose image for location</h4>
            <input
              type="file"
              accept="image/png,image/jpeg"
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
  type: PropTypes.number.isRequired,
};

// TODO: just take in a latLng
/**
 * @param  {number} lat latitude for new public art
 * @param  {number} lng longitude
 * @param  {LOCATION_TYPE} newLocationType optional type of the new location
 */
export function newLocationUpload(lat, lng, newLocationType) {
  const newLocationTypeHasChanged = (
    newLocationType && newLocationType != window.newLocationType);
  if (newLocationTypeHasChanged) window.newLocationType = newLocationType;

  if (window.newLocationType == LOCATION_TYPE.EVENT ||
    window.newLocationType == LOCATION_TYPE.PUBLIC_ART) {
    Auth.currentAuthenticatedUser()
        .then(() => {
          // TODO: should disappear when the 'close' button clicked in new-location div.

          const newLocationMarker = new google.maps.Marker({
            position: {lng: lng, lat: lat},
            map: window.map,
            title: 'New location',
            label: 'N',
          });
          updateMarkers([newLocationMarker]);
          const currentLocationUpload = document.getElementById('new-location-upload');

          if (currentLocationUpload && !newLocationTypeHasChanged) {
            window.updateNewLocationFields(lat, lng);
          } else {
            const sidebar = document.getElementById('sidebar');
            if (!document.getElementsByClassName('new-location-input')) {
            ReactDOM.unmountComponentAtNode(sidebar);
            }
            const handleClose = (event) => {
              closeSidebar();
            };

            ReactDOM.render(
                (<React.Fragment>
                  <PublicArtUploadForm
                    lat={lat}
                    lng={lng}
                    type={window.newLocationType}
                  />
                  <button type="button" onClick={handleClose}
                    className="close">Close</button>
                </React.Fragment>),
                sidebar,
            );
          }
          openSidebar();
        }).catch(() => console.log('Cannot add new marker. No user authenticated.'));
  }
}
