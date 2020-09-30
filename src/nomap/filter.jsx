import DatePicker from 'react-date-picker';
import React from 'react';
import PropTypes from 'prop-types';

export default class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(), // TODO: take date range?
      // time: TODO: worry about this later
      publicPrivate: 'both',
    };
    this.onSearchClick = this.onSearchClick.bind(this);
    this.renderCalendar = this.renderCalendar.bind(this);
    this.renderPublicPrivateChoice = this.renderPublicPrivateChoice.bind(this);
  }

  renderCalendar() {
    return (
      <DatePicker
        onChange={(date) => this.setState({date: date})}
        value={this.state.date}
        showFixedNumberOfWeeks
        className="col"
      />
    );
  }

  renderPublicPrivateChoice() {
    const handleChange = (e) => {
      this.setState({
        publicPrivate: e.target.value,
      });
    };

    return (
      <div id="filter-radio-buttons" className="col">
        <div className="radio-container">
          <input type="radio" value="public" id="public" onChange={handleChange} name="choice" />
          <label htmlFor="public">Public</label>
        </div>

        <div className="radio-container">
          <input type="radio" value="private" id="private" onChange={handleChange} name="choice"/>
          <label htmlFor="private">Private</label>
        </div>

        <div className="radio-container">
          <input type="radio" value="both" id="both" onChange={handleChange} name="choice" defaultChecked/>
          <label htmlFor="both">Both</label>
        </div>
      </div>
    );
  }

  onSearchClick() {
    const variables = {
      is_public: false,
      is_private: false,
      search: {
        start_date: this.state.date.toISOString().substring(0, 10),
        end_date: this.state.date.toISOString().substring(0, 10),
        // 'Bounds' are just appx the bounds of nyc
        // Hard-coding these so we can use our already-written code
        // It may be worth writing a new query
        top_right_gps: {
          lat: 40.843890,
          lon: -73.747242,
        },
        bottom_left_gps: {
          lat: 40.493938,
          lon: -74.278223,
        },
      },
    };
    if (this.state.publicPrivate == 'public' || this.state.publicPrivate == 'both') {
      variables.is_public = true;
    }
    if (this.state.publicPrivate == 'private' || this.state.publicPrivate == 'both') {
      variables.is_private = true;
    }


    this.props.search(variables);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-8 calendar-container">
            <div className="row">
              {this.renderPublicPrivateChoice()}
              {this.renderCalendar()}
            </div>
          </div>
          <div className="col align-self-center">
            <button
              type='button'
              onClick={this.onSearchClick}
              className='btn btn-dark'>
              Search
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Filter.propTypes = {
  search: PropTypes.func.isRequired,
};
