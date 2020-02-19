// Search dialog

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {LOCATION_TYPE} from '../utils/constants';
import Calendar from 'react-calendar';
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

  buttonClassnames(type) {
    let className = 'btn col-4 ';
    if (type == LOCATION_TYPE.PUBLIC_ART) className += 'public-art-selector ';
    else className += 'event-selector ';
    if (type == this.state.type) className += 'btn-primary';
    else className += 'btn-secondary';
    return className;
  }

  renderPublicArtSearch() {
    return (
      <React.Fragment>
        <div className='row art-choice'>
          <label>
            Sculpture
            <input
              name='Sculpture'
              type='checkbox'
              checked={this.state.artSculpture}
              onChange={(event) => this.setState({artSculpture: event.target.checked})}
            />
          </label>
        </div>
        <div className='row art-choice'>
          <label>
            Mural
            <input
              name='Mural'
              type='Checkbox'
              checked={this.state.artMural}
              onChange={(event) => this.setState({artMural: event.target.checked})}
            />
          </label>
        </div>
      </React.Fragment>
    );
  }

  renderEventSearch() {
    return (
      <div className='container'>
        <div className='row justify-content-center'>
          <Calendar
            onChange={(date) => this.setState({eventChosenDate: date})}
            value={this.state.eventChosenDate}
            showFixedNumberOfWeeks
          />
        </div>
        <div className='row art-choice'>
          <label>
            Run by a public entity
            <input
              name='Public'
              type='checkbox'
              checked={this.state.eventPublic}
              onChange={(event) => this.setState({eventPublic: event.target.checked})}
            />
          </label>
        </div>
        <div className='row art-choice'>
          <label>
            Run by a private company
            <input
              name='Private'
              type='Checkbox'
              checked={this.state.eventPrivate}
              onChange={(event) => this.setState({eventPrivate: event.target.checked})}
            />
          </label>
        </div>
      </div>
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
      } else {
        if (this.state.artMural) {
          filter = 'mural';
        } else {
          filter = 'sculpture';
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
        if (newMarkers.length == 0) {
          window.alert('No art found in the area you have selected.' +
            '\nTry zooming out for more options.');
        }
      });
    } else {
      // TODO: is public/private
      // TODO: is family/teen
      getEventWithinMap(
          window.map,
          this.props.bounds,
          this.state.eventChosenDate,
          this.state.eventPublic,
          this.state.eventPrivate,
      ).then((newMarkers) => {
        closeLogin();
        this.props.markersCallback(newMarkers);
        if (newMarkers.length == 0) {
          window.alert('No events found in the area you selected.' +
            '\nTry zooming out or a different date.');
        }
      });
    }
  }

  render() {
    // borrowed from https://codepen.io/itsthomas/pen/rLapRy
    return (
      <React.Fragment>
        <div className='row justify-content-around'>
          <button className={this.buttonClassnames(LOCATION_TYPE.PUBLIC_ART)}
            onClick={() => this.setState({'type': LOCATION_TYPE.PUBLIC_ART})}>
            Public Art
          </button>
          <button className={this.buttonClassnames(LOCATION_TYPE.EVENT)}
            onClick={() => this.setState({'type': LOCATION_TYPE.EVENT})}>
            Events
          </button>
        </div>
        {this.renderSearchForm()}
        <div className='row justify-content-center'>
          <button type='button' onClick={this.search} className='col-sm-2 btn btn-dark'>
            Search
          </button>
        </div>
        <div className='row justify-content-center'>
          <button type='button' onClick={closeLogin} className='col-sm-2 btn btn-light'>
            Cancel
          </button>
        </div>
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
