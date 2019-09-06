import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
import Select from 'react-select';
import gql from 'graphql-tag';
import {v4 as uuid} from 'uuid';

import {uploadImage} from './upload-image';
import {createPublicArt} from '../graphql/mutations';
import setMapAndSidebarStyle from '../utils/set-map-and-sidebar-style';

class PublicArtUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      selectedOption: 'public-art',
    };

    // To upload images in React, we use the file API.
    // https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
    this.imageInput = React.createRef();

    // this.optionChange = this.optionChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.descriptionChange = this.descriptionChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault(); // KTHXWHAT?

    // Only create new location if there is an image file.
    if (this.imageInput.current.files.length > 0 && this.state.name) {
      const locationId = uuid();
      const imgFile = this.imageInput.current.files[0];

      window.client.mutate({
        mutation: gql(createPublicArt),
        variables: {
          input: {
            id: locationId,
            name: this.state.name,
            location: {
              lat: this.props.lat,
              lon: this.props.lng,
            },
            description: (this.state.description ? this.state.description : undefined),
            type: 'sculpture',
          },
        },
      }).then((response) => {
        console.log('Uploaded new location', this.state.name, 'to dynamodb.');
        return uploadImage(imgFile, locationId, '');
      }).then((response) => {
        console.log('Succesffully uploaded image for new location', this.state.name);
      }).catch((err) => {
        console.error('Error uploading new location:', err);
        throw err;
      });
    } else if (!this.state.name) {
      console.warn('New location needs a name.');
    } else {
      console.warn('Need image to create new location.');
    }

    setMapAndSidebarStyle(false);
  }
  handleClose(event) {
    setMapAndSidebarStyle(false);
  }

  // optionChange(selectedOption) {
  //     this.setState({selectedOption: selectedOption});
  // }
  nameChange(event) {
    this.setState({name: event.target.value});
  }

  descriptionChange(event) {
    this.setState({description: event.target.value});
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
          {/* <Select
                        // TODO: this should not include 'all'
                        options={OPTIONS}
                        onChange={this.optionChange}
                    /> */}
          <div>
            <p>Latitude: {this.props.lat}</p>
            <p>Longitude: {this.props.lng}</p>
          </div>
          <div><h4>Choose image for location</h4>
            <input
              type="file"
              accept="image/png"
              ref={this.imageInput}
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
          <button type="submit" className="btn">Upload new location</button>
          <button type="button" onClick={this.handleClose}
            className="close">Close</button>
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

  const sidebar = document.getElementById('sidebar');
  ReactDOM.unmountComponentAtNode(sidebar);

  ReactDOM.render(
      <PublicArtUploadForm
        lat={lat}
        lng={lng}
      />,
      sidebar
  );

  setMapAndSidebarStyle(true);
}
