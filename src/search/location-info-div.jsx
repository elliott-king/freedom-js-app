// Content contained within info window for a given location.
// Includes simple form for flagging/reporting locations.
// Form adapted from: https://www.w3schools.com/howto/howto_js_popup_form.asp

// Forms in React: https://reactjs.org/docs/forms.html

import {Auth} from 'aws-amplify';
import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import {createReported} from '../graphql/mutations';
import {uploadImage} from '../upload/upload-image';
import {closeSidebar} from '../utils/set-map-and-sidebar-style';

// Options for reporting public art.
const options = [
  {value: 'not-public-art', label: 'Location is not public art'},
  {value: 'wrong-photo', label: 'Photo incorrect'},
  {value: 'place-dne', label: 'Location does not exist'},
  {value: 'wrong-location-type', label: 'Mislabeled location type'},
  {value: 'nsfw', label: 'Location has inappropriate or offensive content'},
  {value: 'bad-date-range', label: 'Date range is incorrect.'},
];

export default class LocationInfoDiv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayStyle: {display: 'block'},
      reasonContinued: '',
      selectedOption: '',
      // TODO: think of more elegant solution.
      reported: 0,
      authenticated: false,
    };

    // To upload images in React, we use the file API.
    // https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
    this.imageInput = React.createRef();

    this.reportOptionChange = this.reportOptionChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.reportTextChange = this.reportTextChange.bind(this);
    this.submitLocationReport = this.submitLocationReport.bind(this);
    this.uploadNewImage = this.uploadNewImage.bind(this);

    Auth.currentAuthenticatedUser()
        .then(() => this.setState({authenticated: true}))
        .catch(() => this.setState({authenticated: false}));
  }

  uploadNewImage(event) {
    event.preventDefault();

    if (this.imageInput.current.files.length > 0) {
      const imgFile = this.imageInput.current.files[0];
      // TODO: update description field.
      uploadImage(imgFile, this.props.id, 'Testing: this is a photo file.');
    } else {
      window.alert('Please choose an image to upload.');
      console.warn('Please choose an image to upload.');
    }
  }

  handleClose(event) {
    closeSidebar();
  }

  submitLocationReport(event) {
    event.preventDefault();

    if (!this.state.selectedOption) {
      window.alert('Please choose a reason to report from the dropdown.');
      console.warn('Please choose a reason to report from the dropdown.');
    } else {
      window.cognitoClient.mutate({
        mutation: gql(createReported),
        variables: {
          input: {
            art_id: this.props.id,
            reason: this.state.selectedOption.value,
            reason_continued: (this.state.reasonContinued ?
            this.state.reasonContinued : undefined),
          },
        },
      }).then(( {data: {createReported}}) => {
        this.setState({reported: this.state.reported + 1});
        console.debug('reported:', createReported);
      }).catch((e) => console.log('Error reporting location:', e));
    }
  }

  reportOptionChange(selectedOption) {
    this.setState({selectedOption: selectedOption});
  }
  reportTextChange(event) {
    this.setState({reasonContinued: event.target.value});
  }

  // Render optional things in React:
  // https://stackoverflow.com/questions/44015876
  renderImg() {
    if (this.props.photos && this.props.photos.length > 0) {
      const photo = this.props.photos[0];
      return (
        <div className="location-image-div">
          <img className="location-image" src={photo}/>
        </div>);
    } else {
      return null;
    }
  }

  renderUploadImageForm() {
    if (this.state.authenticated) {
      return (
        <form
          className = "new-image-form"
          onSubmit={this.uploadNewImage}
        >
          <h4>Upload new image</h4>
          <input
            type="file"
            accept="image/png"
            ref={this.imageInput}
          />
          <button type="submit" className="btn">Upload</button>
        </form>
      );
    } else return null;
  }

  renderReportLocationForm() {
    if (this.state.authenticated) {
      return (
        <form style={this.state.displayStyle}
          className="report-location-popup"
          onSubmit={this.submitLocationReport}>
          <h4>Report Location</h4>
          <Select
            options={options}
            onChange={this.reportOptionChange}
          />
          <label>Feel free to expand your reason:</label>
          <input type="text"
            placeholder="Reason Continued"
            name="reason-continued"
            value={this.state.reasonContinued}
            onChange={this.reportTextChange}
          />
          <button type="submit" className="btn">Report Location</button>
        </form>
      );
    } else return null;
  }

  renderDates() {
    if (!this.props.permanent) {
      const s = new Date(this.props.dates.start).toDateString();
      const e = new Date(this.props.dates.start).toDateString();
      return (
        <p>{s} - {e}</p>
      );
    } else {
      return null;
    }
  }

  renderResponseOfReporting() {
    if (this.state.reported > 0) {
      return (<p id="location-reported">
        Issue &quot;{this.state.selectedOption.label}&quot;
        for location &quot;{this.props.name}&quot; reported.
      </p>);
    } else {
      return null;
    }
  }

  render() {
    return (
      <div id="location-content">
        <div className="location-head-info">
          <h3>{this.props.name}</h3>
          {this.renderImg()}
          {this.renderDates()}
        </div>
        {this.renderUploadImageForm()}
        {this.renderReportLocationForm()}
        {this.renderResponseOfReporting()}
        <button type="button" onClick={this.handleClose}
          className="close">Close</button>
      </div>
    );
  }
}
LocationInfoDiv.propTypes = {
  name: PropTypes.string.isRequired,
  photos: PropTypes.array,
  id: PropTypes.string.isRequired,
  permanent: PropTypes.bool,
  dates: PropTypes.object,
};
