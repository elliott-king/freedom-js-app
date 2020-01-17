import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import Select from 'react-select';
import DatePicker from 'react-date-picker';

import {getPublicArtWithinMap, getEventWithinMap} from './location-search.jsx';
// eslint-disable-next-line no-unused-vars
import {ALL_OPTIONS, locationType} from '../utils/constants';

// Needed to avoid error w/ async fns
// https://stackoverflow.com/questions/28976748/regeneratorruntime-is-not-defined
import 'babel-polyfill';
import {newLocationUpload} from '../upload/new-location.jsx';

const permanencyOptions = [
  {value: true, label: 'Permanent installation'},
  {value: false, label: 'Temporary installation'},
];

export class PublicArtSearchButton extends React.Component {
  constructor(props) {
    super(props);
    this.typeChange = this.typeChange.bind(this);
    this.permanentChange = this.permanentChange.bind(this);
    this.state = {filter: 'all', permanent: true};
  }

  typeChange(selectedOption) {
    this.setState({filter: selectedOption.value});
  }
  permanentChange(selectedOption) {
    this.setState({permanent: selectedOption.value});
  }

  render() {
    return (
      <div
        className="map-button-ui"
        title="Find nearby public art">
        <div className="public-art-dropdowns">
          <Select
            menuPlacement="top"
            options={ALL_OPTIONS}
            isClearable={false}
            defaultValue={ALL_OPTIONS[0]}
            onChange={this.typeChange}
          />
          <Select
            menuPlacement="top"
            options={permanencyOptions}
            isClearable={false}
            defaultValue={permanencyOptions[0]}
            onChange={this.permanentChange}
          />
        </div>
        <div className="map-button-text"
          onClick={() => getPublicArtWithinMap(
              window.map,
              this.state.filter,
              this.state.permanent,
          ).then(this.props.markersCallback)}>
          Public Art Search
        </div>
        <div className="map-button-text"
          onClick={() => {
            const center = window.map.getCenter();
            newLocationUpload(center.lat(), center.lng(), locationType.PUBLIC_ART);
          }}>
          New Public Art
        </div>
      </div>
    );
  }
}
PublicArtSearchButton.propTypes = {
  markersCallback: PropTypes.func.isRequired,
};


export class EventSearchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenDate: new Date(),
    };
  }

  render() {
    return (
      <div
        className="map-button-ui"
        title="Find nearby events">
        <React.Fragment>
          <DatePicker
            onChange={(date) => this.setState({chosenDate: date})}
            value={this.state.chosenDate}
            showFixedNumberOfWeeks
          />
          <div className="map-button-text"
            onClick={() => {
              getEventWithinMap(window.map, this.state.chosenDate).then((newMarkers) => {
                this.props.markersCallback(newMarkers);
              });
            }}>
            Event Search
          </div>
          <div className="map-button-text"
            onClick={() => {
              const center = window.map.getCenter();
              newLocationUpload(center.lat(), center.lng(), locationType.EVENT);
            }}>
            New Event
          </div>
        </React.Fragment>
      </div>
    );
  }
}
EventSearchButton.propTypes = {
  markersCallback: PropTypes.func.isRequired,
};
