// Content contained within info window for a given location.
// Includes simple form for flagging/reporting locations.
// Form adapted from: https://www.w3schools.com/howto/howto_js_popup_form.asp

// Forms in React: https://reactjs.org/docs/forms.html

import {Auth} from 'aws-amplify';
import React from 'react';
import PropTypes from 'prop-types';

import {closeSidebar} from '../utils/set-map-and-sidebar-style';
import {LOCATION_TYPE} from '../utils/constants';

export default class LocationInfoDiv extends React.Component {
  constructor(props) {
    super(props);

    let dates = false;
    if (this.props.type == LOCATION_TYPE.PUBLIC_ART) {
      if (!this.props.location.permanent) {
        const s = new Date(this.props.location.dates.start);
        const e = new Date(this.props.location.dates.end);

        dates = new Set();
        while (s <= e) {
          dates.add(new Date(s));
          s.setDate(s.getDate() + 1);
        }
      }
    } else dates = new Set(this.props.location.dates);

    this.state = {
      displayStyle: {display: 'block'},
      reasonContinued: '',
      selectedOption: '',
      // TODO: think of more elegant solution.
      reported: 0,
      authenticated: false,
      calendar: this.setupCalendar(),
      dates: dates,
      uploadedImage: false,
    };

    this.handleClose = this.handleClose.bind(this);
    Auth.currentAuthenticatedUser()
        .then(() => this.setState({authenticated: true}))
        .catch(() => this.setState({authenticated: false}));
  }

  componentDidMount() {
    if (this.state.dates) {
      this.state.calendar.init();
    }
  }

  handleClose(event) {
    closeSidebar();
  }

  // Render optional things in React:
  // https://stackoverflow.com/questions/44015876
  renderImg() {
    if (this.props.location.photos && this.props.location.photos.items.length > 0) {
      const photo = this.props.location.photos.items[0];
      return (
        <div className="location-image-div">
          <img className="location-image" src={photo.url}/>
        </div>);
    } else {
      return null;
    }
  }

  renderWebsite() {
    if (this.props.location.website) {
      return <a
        href={this.props.location.website}
        target='_blank'
        rel='noopener noreferrer'>
        {this.props.location.host}</a>;
    } else return null;
  }

  /** Set up calendar fns.
   * Adapted from https://code.tutsplus.com/tutorials/how-to-build-a-beautiful-calendar-widget--net-12538
   *
   * @returns {object} containing calendar fns
   */
  setupCalendar() {
    let label;
    const months = ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const init = () => {
      let date = new Date();
      if (this.props.date) date = this.props.date;
      label = document.getElementById('label');
      document.getElementById('prev').onclick = () => switchMonth(false);
      document.getElementById('next').onclick = () => switchMonth(true);
      label.onclick = () => switchMonth(null, date.getMonth(), date.getFullYear());
      label.click();
    };

    const switchMonth = (next, month, year) => {
      const curr = label.textContent.trim().split(' ');
      const tempYear = parseInt(curr[1], 10);
      month = (month !== null && month !== undefined) ? month : (
        (next) ?
        ((curr[0] === 'December') ? 0 : months.indexOf(curr[0]) + 1) :
        ((curr[0] === 'January') ? 11 : months.indexOf(curr[0]) - 1)
      );
      year = year || (
        (next && month === 0) ?
        tempYear + 1 :
        (!next && month === 11) ? tempYear - 1 : tempYear
      );

      const calendar = createCal(year, month);
      document.querySelector('.cal-curr').remove();
      document.getElementById('cal-frame').appendChild(calendar.calendar());
      document.getElementById('label').textContent = calendar.label;
    };

    const createCal = (year, month) => {
      let day = 1;
      let haveDays = true;
      let startDay = new Date(year, month, day).getDay();

      let i;
      let j;

      const feb = ((year%4==0)&&(year%100!=0))||(year%400==0) ? 29 : 28;
      const daysInMonths = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const cal = [];

      if (createCal.cache[year]) {
        if (createCal.cache[year][month]) {
          return createCal.cache[year][month];
        }
      } else {
        createCal.cache[year] = {};
      }
      i = 0;
      while (haveDays) {
        cal[i] = [];
        for (j = 0; j < 7; j++) {
          if (i === 0) {
            if (j === startDay) {
              cal[i][j] = day++;
              startDay++;
            }
          } else if (day <= daysInMonths[month]) {
            cal[i][j] = day++;
          } else {
            cal[i][j] = '';
            haveDays = false;
          }
          if (day > daysInMonths[month]) {
            haveDays = false;
          }
        }
        i++;
      }
      for (i = 0; i < cal.length; i++) {
        cal[i] = '<tr><td>' + cal[i].join('</td><td>') + '</td></tr>';
      }

      const element = document.createElement('table');
      element.innerHTML = '<tbody>' + cal.join('') + '</tbody>';
      element.classList.add('cal-curr');
      element.querySelectorAll('td:empty').forEach((e) => e.classList.add('cal-nil'));
      element.querySelectorAll('td').forEach((td) => {
        const date = (year.toString() + '-' +
          (month + 1).toString().padStart(2, '0') + '-' +
          td.textContent.padStart(2, '0')
        );
        if (this.state.dates.has(date)) td.classList.add('cal-event-day');
        if (new Date().toISOString().substring(0, 10) === date) {
          td.classList.add('cal-today');
        }
      });
      createCal.cache[year][month] = {
        calendar: () => {
          return element;
        },
        label: months[month] + ' ' + year,
      };

      return createCal.cache[year][month];
    };
    createCal.cache = {};
    return {
      init: init,
      switchMonth: switchMonth,
      createCal: createCal,
    };
  }

  renderDescription() {
    // I don't feel that a description is currently necessary if there is a photo
    // Photos are self explanatory, and this provides less clutter
    if (this.props.type == LOCATION_TYPE.EVENT && !this.props.location.photos) {
      return <p>{this.props.location.description}</p>;
    } else return null;
  }

  renderDates() {
    if (this.state.dates) {
      // TODO: print times
      console.debug('Show times as well as dates for events.');
      return (
        <div id='cal'>
          <div className='cal-header'>
            <span className="left button" id="prev"> &lang; </span>
            <span className="left hook"></span>
            <span className="month-year" id="label"> June 20&0 </span>
            <span className="right hook"></span>
            <span className="right button" id="next"> &rang; </span>
          </div>
          <table id="cal-days">
            <tbody>
              <tr>
                <td>sun</td>
                <td>mon</td>
                <td>tue</td>
                <td>wed</td>
                <td>thu</td>
                <td>fri</td>
                <td>sat</td>
              </tr>
            </tbody>
          </table>
          <div id="cal-frame">
            <table className="cal-curr">
              <tbody></tbody>
            </table>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div id="location-content">
        <div className="location-head-info">
          <h3>{this.props.location.name}</h3>
          {this.renderImg()}
          {this.renderDescription()}
          {this.renderDates()}
          {this.renderWebsite()}
        </div>
        <button type="button" onClick={this.handleClose}
          className="close">Close</button>
      </div>
    );
  }
}
LocationInfoDiv.propTypes = {
  location: PropTypes.object.isRequired,
  type: PropTypes.number.isRequired,
  date: PropTypes.object,
};
