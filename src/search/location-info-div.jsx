// Content contained within info window for a given location.
// Includes simple form for flagging/reporting locations.
// Form adapted from: https://www.w3schools.com/howto/howto_js_popup_form.asp

// Forms in React: https://reactjs.org/docs/forms.html

import React from 'react';
import Select from 'react-select';

import gql from 'graphql-tag';
import { flagLocation } from '../graphql/mutations';
import { uploadImage } from '../upload/upload-image';

// Options for reporting public art.
const options = [
    {value: "not-public-art", label: "Location is not public art"},
    {value: "wrong-photo", label: "Photo incorrect"},
    {value: "place-dne", label: "Location does not exist"}
];


// TODO: would like to make form appear/disappear.
// See style changes in response to state change:
// https://stackoverflow.com/questions/33593478
export default class LocationInfoDiv extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            displayStyle: {display: "block"},
            reasonContinued: "",
            selectedOption: "",
            // TODO: think of more elegant solution.
            reported: 0
        };

        // To upload images in React, we use the file API.
        // https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
        this.imageInput = React.createRef();

        this.reportOptionChange = this.reportOptionChange.bind(this);
        this.reportTextChange = this.reportTextChange.bind(this);
        this.submitLocationReport = this.submitLocationReport.bind(this);
        this.uploadNewImage = this.uploadNewImage.bind(this);
    }

    uploadNewImage(event) {
        event.preventDefault();

        if (this.imageInput.current.files.length > 0) {
            let img_file = this.imageInput.current.files[0];
            // TODO: update description field.
            uploadImage(img_file, this.props.id, "Testing: this is a photo file.");
        } // TODO: else log that there is not an image to upload.
    }

    submitLocationReport(event) {
        event.preventDefault();

        window.client.mutate({
            mutation: gql(flagLocation),
            variables: {
                input: {
                    name: this.props.name,
                    reason: this.state.selectedOption.value,
                    reason_continued: (this.state.reasonContinued ? this.state.reasonContinued : undefined)
                }
            }
        }).then(( { data: {flagLocation} }) => {
            this.setState({reported: this.state.reported + 1});
            console.debug("reported:", flagLocation);
        });
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
        if (this.props.photos && this.props.photos.length > 0) {
            var photo = this.props.photos[0];
            return <img src={photo}/>
        } else {
            return null;
        }
    }

    renderResponseOfReporting() {
        if (this.state.reported > 0){
            return <p id="location-reported">Issue "{this.state.selectedOption.label}" for location "{this.props.name}" reported.</p>
        } else {
            return null;
        }
    }

    render() {
        return (
            <div id="content">
                <h3>{this.props.name}</h3>
                {this.renderImg()}
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
                <form style={this.state.displayStyle} 
                    className="report-location-popup"
                    onSubmit={this.submitLocationReport}>
                    <h4>Report location: {this.props.name}</h4>
                    <Select
                        options={options}
                        onChange={this.reportOptionChange}
                    />
                    {/* NOTE: commented code creates "Warning: Invalid DOM property `for`. Did you mean `htmlFor`?"
                    TODO: Consider fixing for screenreaders, etc? */}
                    <label>Feel free to expand your reason:</label>
                    <input type="text" 
                        placeholder="Reason Continued" 
                        name="reason-continued" 
                        value={this.state.reasonContinued} 
                        onChange={this.reportTextChange}
                        />
                    <button type="submit" className="btn">Report Location</button>
                </form>
                {this.renderResponseOfReporting()}
            </div>
        )
    }
}