import React from 'react';
import PropTypes from 'prop-types';

class EventTile extends React.Component {
  constructor(props) {
    super(props);
  }

  renderImg() {
    if (this.props.location.photos && this.props.location.photos.items.length > 0) {
      const photo = this.props.location.photos.items[0];
      return (
        <div className="col-sm-2 event-item img-holder border">
          <img className="img-fluid event-img" src={photo.url}/>
        </div>
      );
    } else {
      return <div className="col-sm-2 event-item img-holder border"></div>;
    }
  }

  render() {
    const description = this.props.location.description.substring(0, 270) + '...';
    return (
      <div className="event-row row bg-light">
        {this.renderImg()}
        <div className="col-sm-10 event-item border">
          <div className="event-header row">
            <h4 className="col-8">
              <a href={this.props.location.website}
                target="_blank"
                rel="noopener noreferrer">
                {this.props.location.name}
              </a>
            </h4>
            <div className="col">
              <div className="row">
                <div className="col">
                  <p className="row">{this.props.location.host}</p>
                  <div className="row">
                    <p className="col-md">{this.props.location.dates[0].substring(5)}</p>
                    <p className="col-md">{this.props.location.times[0].substring(0, 5)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="event-content row">
            <p className="col event-description">{description}</p>
          </div>
        </div>
      </div>
    );
  }
}
EventTile.propTypes = {
  location: PropTypes.object.isRequired,
};

export default class EventTileContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  renderEmptyNotification() {
    if (this.props.locations.length < 1) return <h2>No Events Found</h2>;
    return null;
  }

  render() {
    return (
      <div className="event-tile-container container-fluid">
        {this.renderEmptyNotification()}
        {this.props.locations.map((location, i) =>
          <EventTile key={i} location={location}/>)}
      </div>
    );
  }
}
EventTileContainer.propTypes = {
  locations: PropTypes.array.isRequired,
};
