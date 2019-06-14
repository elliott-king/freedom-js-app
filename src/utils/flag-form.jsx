import React from 'react';
import Select from 'react-select';

import { v4 as uuid } from 'uuid';

import gql from 'graphql-tag';
import { flagLocation, createPhoto } from '../graphql/mutations';

// import { createClient } from './client-handler';

import { Storage, Auth } from 'aws-amplify';
import aws_config from '../aws-exports';

// Options for flagging public art.
const options = [
    {value: "not-public-art", label: "Location is not public art"},
    {value: "wrong-photo", label: "Photo incorrect"},
    {value: "place-dne", label: "Location does not exist"}
];

// Content contained within info window for a given location.
// Includes simple form for flagging/reporting locations.
// Form adapted from: https://www.w3schools.com/howto/howto_js_popup_form.asp

// Forms in React: https://reactjs.org/docs/forms.html

// TODO: would like to make form appear/disappear.
// See style changes in response to state change:
// https://stackoverflow.com/questions/33593478
export default class FlagLocationPopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            imageFile: "",
            displayStyle: {display: "block"},
            reasonContinued: "",
            selectedOption: "",
            // TODO: think of more elegant solution.
            reported: 0
        };

        // To upload images in React, use file API.
        // https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
        this.imageInput = React.createRef();
        this.optionChange = this.optionChange.bind(this);
        this.textChange = this.textChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.imageChange = this.imageChange.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    uploadImage(event) {
        event.preventDefault(); // ...?

        // const client = createClient();

        (async () => {
            let file;
            let photo_id;

            if (this.imageInput.current.files.length > 0) {
                let img_file = this.imageInput.current.files[0];
                console.log('file to upload:', img_file);

                // NOTE: Using only amplify Storage module
                // photo_id = uuid();
                // Storage.put(photo_id + '.png', img_file, {
                //     contentType: 'image/png',
                // })
                // .then(result => console.log('result of image upload:', result))
                // .catch(err => console.error(err));

                // NOTE: Attempting to use the AppSync API w/ complex objects uploading
                const { name: filename, type: mimeType } = img_file;
                const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(filename);
                console.log('filename, extension', filename, extension);

                const bucket = aws_config.aws_user_files_s3_bucket;
                const region = aws_config.aws_user_files_s3_bucket_region;
                // const visibility = 'public'; // If public, will show publicly in bucket?
                const visibility = 'private';
                const {identityId} = await Auth.currentCredentials();

                photo_id = uuid();
                const key = `${visibility}/${identityId}/${photo_id}${extension && '.'}${extension}`;
                
                file = {
                    bucket, 
                    key,
                    region,
                    mimeType,
                    localUri: img_file,
                };
                console.log('file object:', file);
                console.log('targeting location:', this.props.name);
                console.log('location has id:', this.props.id);
            }

            // const result = await 
            this.props.client.mutate({
                mutation: gql(createPhoto),
                variables: {
                    input: {
                        // file: {file, __typename: 'S3Object' },
                        photo_id: photo_id,
                        location_id: this.props.id,
                        description: 'First test: this is a photo file',
                        file: file
                        // __typename: 'Photo',
                    }
                }
            })
            .then( result => console.log('result of image upload:', result))
            .catch(err => console.error(err));
        })();
    }

    handleSubmit(event) {
        event.preventDefault(); // KTHXWHAT????

        // const client = createClient();

        this.props.client.mutate({
            mutation: gql(flagLocation),
            variables: {
                input: {
                    name: this.props.name,
                    reason: this.state.selectedOption.value,
                    reason_continued: this.state.reasonContinued
                }
            }
        }).then(( { data: {flagLocation} }) => {
            this.setState({reported: this.state.reported + 1});
            console.debug("flagged:", flagLocation);
        });
    }

    optionChange(selectedOption) {
        this.setState({selectedOption: selectedOption});
    }
    textChange(event) {
        this.setState({reasonContinued: event.target.value});
    }
    // imageChange(event) {
    //     console.log(event.target);
    //     this.setState({imageFile: event.target.files[0]});
    // }

    // Render optional things in React:
    // https://stackoverflow.com/questions/44015876
    renderImg() {
        if (this.props.photos && this.props.photos.length > 0) {
            var photo = JSON.parse(this.props.photos[0]);
            return <img src={photo.link}/>
        } else {
            return null;
        }
    }

    renderResponse() {
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
                    onSubmit={this.uploadImage}
                >
                    <h4>Upload new image</h4>
                    <input 
                        type="file"
                        accept="image/png"
                        ref={this.imageInput}
                        // value={this.state.imageFile}
                        // onChange={this.imageChange}
                    />
                    <button type="submit" className="btn">Upload</button>
                </form>
                <form style={this.state.displayStyle} 
                    className="flag-location-popup"
                    onSubmit={this.handleSubmit}>
                    <h4>Report location: {this.props.name}</h4>
                    <Select
                        options={options}
                        onChange={this.optionChange}
                    />
                    {/* NOTE: commented code creates "Warning: Invalid DOM property `for`. Did you mean `htmlFor`?"
                    Consider fixing for screenreaders etc? */}
                    {/* <label for="reason-continued">Feel free to expand your reason:</label> */}
                    <label>Feel free to expand your reason:</label>
                    <input type="text" 
                        placeholder="Reason Continued" 
                        name="reason-continued" 
                        value={this.state.reasonContinued} 
                        onChange={this.textChange}
                        />
                    <button type="submit" className="btn">Report Location</button>
                    {/* <button type="submit" className="btn cancel" onClick={this.closeForm}>Cancel</button> */}
                </form>
                {this.renderResponse()}
            </div>
        )
    }
}