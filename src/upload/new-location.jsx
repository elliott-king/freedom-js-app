import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';

import {OPTIONS} from '../utils/constants';

class PublicArtUploadForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageFile: "",
            name: "",
            description: "",
            selectedOption: "public-art"
        };
        this.optionChange = this.optionChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.imageChange = this.imageChange.bind(this);
        this.descriptionChange = this.descriptionChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault(); // KTHXWHAT?

        // TODO: need a check on mandatory fields. 
        // Could just rely on server throwing an error.
        console.log("Submit location:", this.state);
        // TODO: nothing actually here yet.

        // Delete a div from the DOM.
        // https://stackoverflow.com/questions/8404797/
        var f = document.getElementById("public-art-upload-form");
        f.parentNode.removeChild(f);
    }
    handleClose(event) {
        event.preventDefault();
        var f = document.getElementById("public-art-upload-form");
        f.parentNode.removeChild(f);
    }

    optionChange(selectedOption) {
        this.setState({selectedOption: selectedOption});
    }
    nameChange(event) {
        this.setState({name: event.target.value});
    }

    descriptionChange(event) {
        this.setState({description: event.target.value});
    }
    imageChange(event) {
        this.setState({imageFile: event.target.value});
    }

    // center div horizontally & vertically
    // https://stackoverflow.com/questions/22658141
    render() {
        return (
            <div 
            id="public-art-upload-form"
            className="public-art-upload-form"
            >
                <form onSubmit={this.handleSubmit}>
                    <h3>Upload new public art.</h3>
                    <input type="text"
                        placeholder="Name"
                        name="name"
                        value={this.state.name}
                        onChange={this.nameChange}
                    />
                    {/* <Select
                        // TODO: this should not include 'all'
                        options={OPTIONS}
                        onChange={this.optionChange}
                    /> */}
                    <div>
                        <p>Latitude: {this.props.lat}</p>
                        <p>Longitude: {this.props.lng}</p>
                    </div>
                    <div><h4>Choose image for location</h4>
                        <input 
                            type="file"
                            value={this.state.imageFile}
                            onChange={this.imageChange}
                        />
                    </div>
                    <div>
                        <input type="text"
                            placeholder="Description"
                            name="description"
                            value={this.state.description}
                            onChange={this.descriptionChange}
                        />
                    </div>
                    <button type="submit" className="btn">Upload location</button>
                    <button type="button" onClick={this.handleClose} className="close">Close</button>
                </form>
            </div>
        )
    }
}

// TODO: just take in a latLng
// TODO: upload items to S3
export function newPublicArtUpload(lat, lng) {
    console.debug("New click event at:", lat, lng);

    var publicArtUploadDiv = document.createElement('div');
    document.getElementById('root').appendChild(publicArtUploadDiv);

    // TODO: needs an 'x' exit button.
    ReactDOM.render(
        <PublicArtUploadForm
            lat={lat}
            lng={lng}
        />,
        publicArtUploadDiv
    );

}