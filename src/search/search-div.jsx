// Search dialog

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {LOCATION_TYPE} from '../utils/constants';
import DatePicker from 'react-date-picker';
import {getPublicArtWithinMap, getEventWithinMap} from './location-search.jsx';
import {closeLogin, openLargeScreen} from '../utils/set-map-and-sidebar-style';

class SearchDiv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: LOCATION_TYPE.PUBLIC_ART,

      artSculpture: true,
      artMural: true,
      artPermanent: true,

      eventChosenDate: new Date(),
      eventPublic: true,
      eventPrivate: true,
      // eventFamily: true,
      // eventTeen: true,
      // eventAthletic: true,  // probably overkill to incl atm
      // eventEducation: true, // probably overkill to incl atm
    };

    this.search = this.search.bind(this);
  }

  renderPublicArtSearch() {
    return (
      <React.Fragment>
        <label>
          Sculpture
          <input
            name="Sculpture"
            type="checkbox"
            checked={this.state.artSculpture}
            onChange={(event) => this.setState({artSculpture: event.target.checked})}
          />
        </label>
        <label>
          Mural
          <input
            name="Mural"
            type="Checkbox"
            checked={this.state.artMural}
            onChange={(event) => this.setState({artMural: event.target.checked})}
          />
        </label>
      </React.Fragment>
    );
  }

  renderEventSearch() {
    return (
      <React.Fragment>
        <DatePicker
          onChange={(date) => this.setState({eventChosenDate: date})}
          value={this.state.eventChosenDate}
          showFixedNumberOfWeeks
        />
        {/* <label>
          Family event
          <input
            name="Family"
            type="Checkbox"
            checked={this.state.eventFamily}
            onChange={(event) => this.setState({eventFamily: event.target.checked})}
          />
        </label>
        <label>
          Teen event
          <input
            name="Teen"
            type="Checkbox"
            checked={this.state.eventTeen}
            onChange={(event) => this.setState({eventTeen: event.target.checked})}
          />
        </label> */}
      </React.Fragment>
    );
  }

  renderSearchForm() {
    if (this.state.type == LOCATION_TYPE.PUBLIC_ART) {
      return this.renderPublicArtSearch();
    } else return this.renderEventSearch();
  }

  search() {
    if (this.state.type == LOCATION_TYPE.PUBLIC_ART) {
      let filter; // TODO: handle values as constant like location-search-button
      if (this.state.artMural && this.state.artSculpture) {
        filter = 'all';
        console.log('setting art type as all');
      } else {
        if (this.state.artMural) {
          filter = 'mural';
          console.log('setting art type as mural');
        } else {
          filter = 'sculpture';
          console.log('setting art type as sculpture');
        }
      }
      getPublicArtWithinMap(
          window.map,
          this.props.bounds,
          filter,
          this.state.artPermanent,
      ).then((newMarkers) => {
        closeLogin();
        this.props.markersCallback(newMarkers);
      });
    } else {
      // TODO: is public/private
      // TODO: is family/teen
      getEventWithinMap(
          window.map,
          this.props.bounds,
          this.state.eventChosenDate,
      ).then((newMarkers) => {
        closeLogin();
        this.props.markersCallback(newMarkers);
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* // borrowed from https://codepen.io/itsthomas/pen/rLapRy
        // TODO: switch from clearfix to flexbox/ display:inline-block
        // https://stackoverflow.com/questions/8554043/ */}
        <div className='selector-button-container clearfix'>
          <div className='col-xs-6 public-art-selector'>
            <button className='btn public-art-selector'
              onClick={() => this.setState({'type': LOCATION_TYPE.PUBLIC_ART})}>
              Public Art
            </button>
          </div>
          <div className='col-xs-6 event-selector'>
            <button className='btn event-selector'
              onClick={() => this.setState({'type': LOCATION_TYPE.EVENT})}>
              Events
            </button>
          </div>
        </div>
        <div className="TODO: decide the class">{this.renderSearchForm()}</div>
        <button type="button" onClick={this.search} className="search">
          Search
        </button>
        <button type="button" className="close" onClick={closeLogin}>
          Cancel
        </button>
      </React.Fragment>
    );
  }
}
SearchDiv.propTypes = {
  markersCallback: PropTypes.func.isRequired,
  bounds: PropTypes.object.isRequired,
};
/**
 * @param  {Function} markersCallback to call on the new markers
 */
export function openSearchDialog(markersCallback) {
  const loginDiv = openLargeScreen();
  ReactDOM.render(
      <SearchDiv
        markersCallback={markersCallback}
        bounds={window.map.getBounds()}
      />,
      loginDiv,
  );
}
