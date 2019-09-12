import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import Select from 'react-select';

import {getPublicArtWithinMap} from './location-search.jsx';
// eslint-disable-next-line no-unused-vars
import {ALL_OPTIONS} from '../utils/constants';

// Needed to avoid error w/ async fns
// https://stackoverflow.com/questions/28976748/regeneratorruntime-is-not-defined
import 'babel-polyfill';

export default class LocationSearchButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {filter: 'all'};
  }

  handleChange(selectedOption) {
    this.setState({filter: selectedOption.value});
  }
  render() {
    return (
      <div
        className="map-button-ui"
        title="Find nearby public art">
        <div className="public-art-dropdown">
          <Select
            menuPlacement="top"
            options={ALL_OPTIONS}
            isClearable={false}
            defaultValue={ALL_OPTIONS[0]}
            onChange={this.handleChange}
          />
        </div>
        <div className="map-button-text"
          onClick={() => getPublicArtWithinMap(
              window.map,
              this.state.filter,
              this.props.markersCallback
          )}>
          Public Art Search
        </div>
      </div>
    );
  }
}
LocationSearchButton.propTypes = {
  markersCallback: PropTypes.func.isRequired,
};
