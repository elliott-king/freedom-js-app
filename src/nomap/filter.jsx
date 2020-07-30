import DatePicker from 'react-date-picker';
import React from 'react';
import PropTypes from 'prop-types';

export default class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(), // TODO: take date range?
      // time: TODO: worry about this later
      public: true,
      private: true,
      family: false,
      types: [],
    };
    this.onSearchClick = this.onSearchClick.bind(this);
    this.renderCalendar = this.renderCalendar.bind(this);
  }

  renderCalendar() {
    return (
      <DatePicker
        onChange={(date) => this.setState({date: date})}
        value={this.state.date}
        showFixedNumberOfWeeks
        className="float-right"
      />
    );
  }

  onSearchClick() {
    const variables = {
      is_public: this.state.public,
      is_private: this.state.private,
      family: this.state.family,
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

    this.props.search(variables);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-8 calendar-container">
            {this.renderCalendar()}
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
