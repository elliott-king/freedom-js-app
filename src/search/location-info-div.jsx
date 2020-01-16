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
import {locationType} from '../utils/constants';

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

    let dates = false;
    if (this.props.type == locationType.PUBLIC_ART) {
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

  componentDidMount() {
    if (this.state.dates) {
      this.state.calendar.init();
    }
  }

  uploadNewImage(event) {
    event.preventDefault();

    if (this.imageInput.current.files.length > 0) {
      uploadImage(this.imageInput.current.files[0], this.props.location.id);
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
            art_id: this.props.location.id,
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

  renderUploadImageForm() {
    if (this.props.type == locationType.EVENT) {
      console.debug('TODO: handle image uploading for events.');
      return null;
    }
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
    }
    return null;
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
    if (this.props.type == locationType.EVENT && !this.props.location.photos) {
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
            <td>sun</td>
            <td>mon</td>
            <td>tue</td>
            <td>wed</td>
            <td>thu</td>
            <td>fri</td>
            <td>sat</td>
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

  renderResponseOfReporting() {
    if (this.state.reported > 0) {
      return (<p id="location-reported">
        Issue &quot;{this.state.selectedOption.label}&quot;
        for location &quot;{this.props.location.name}&quot; reported.
      </p>);
    } else {
      return null;
    }
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
  location: PropTypes.object.isRequired,
  type: PropTypes.number.isRequired,
  date: PropTypes.object,
};
