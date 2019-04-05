import React from 'react';
import Select from 'react-select';

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
export default class FlagLocationPopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            displayStyle: {display: "block"},
            reasonContinued: "",
            selectedOption: "",
        };
        this.optionChange = this.optionChange.bind(this);
        this.textChange = this.textChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        console.log("Flagged:", this.state);
        event.preventDefault(); // KTHXWHAT????
        // TODO: add issue to dynamoDB
    }

    optionChange(selectedOption) {
        this.setState({selectedOption: selectedOption});
    }
    textChange(event) {
        this.setState({reasonContinued: event.target.value});
    }

    renderImg() {
        if (this.props.photos.length > 0) {
            var photo = JSON.parse(this.props.photos[0]);
            return <img src={photo.link}/>
        } else {
            return null;
        }
    }

    // Style changes in response to state change.
    // Taken from: https://stackoverflow.com/questions/33593478
    render() {
        return (
            <div id="content">
                <h3>{this.props.name}</h3>
                {/* Render optional things in React:
                https://stackoverflow.com/questions/44015876 */}
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
            </div>
        )
    }
}