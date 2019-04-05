import React from 'react';
import Select from 'react-select';
import gql from 'graphql-tag';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import aws_config from '../aws-exports';
import { flagPublicArt } from '../graphql/mutations';

function createClient() {
    return new AWSAppSyncClient({
        url: aws_config.aws_appsync_graphqlEndpoint,
        region: aws_config.aws_appsync_region,
        auth: {
            type: AUTH_TYPE.API_KEY,
            apiKey: aws_config.aws_appsync_apiKey,
        }
    });
}

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
            displayStyle: {display: "block"},
            reasonContinued: "",
            selectedOption: "",
            // TODO: think of more elegant solution.
            reported: 0
        };
        this.optionChange = this.optionChange.bind(this);
        this.textChange = this.textChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault(); // KTHXWHAT????

        var client = createClient();

        client.mutate({
            mutation: gql(flagPublicArt),
            variables: {
                input: {
                    name: this.props.name,
                    reason: this.state.selectedOption.value,
                    reason_continued: this.state.reasonContinued
                }
            }
        }).then(( { data: {flagPublicArt} }) => {
            this.setState({reported: this.state.reported + 1});
            console.debug("flagged:", flagPublicArt);
        });
    }

    optionChange(selectedOption) {
        this.setState({selectedOption: selectedOption});
    }
    textChange(event) {
        this.setState({reasonContinued: event.target.value});
    }

    // Render optional things in React:
    // https://stackoverflow.com/questions/44015876
    renderImg() {
        if (this.props.photos.length > 0) {
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