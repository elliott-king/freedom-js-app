import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import Select from 'react-select';

import {getPublicArtWithinMap} from './location-search.jsx';
// eslint-disable-next-line no-unused-vars
import {OPTIONS} from '../utils/constants';

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
      <div className="public-art-ui">
        <React.Fragment>
          <button className="public-art-button"
            title="Click to find nearby public art."
            onClick={() => getPublicArtWithinMap(
                this.props.map,
                this.state.filter,
                this.props.markersCallback
            )}>
                        Public Art Search
          </button>
          {/* <div className="public-art-dropdown">
                        <Select
                            menuPlacement="top"
                            options={OPTIONS}
                            isClearable={false}
                            defaultValue={OPTIONS[0]}
                            onChange={this.handleChange}
                        />
                    </div> */}
        </React.Fragment>
      </div>
    );
  }
}
LocationSearchButton.propTypes = {
  map: PropTypes.object.isRequired,
  markersCallback: PropTypes.func.isRequired,
};
