import React from 'react';

class PublicArtText extends React.Component {
    render() {
        return (
            <div className="public-art-text">Public Art</div>
        )
    }
}

class PublicArtUi extends React.Component {
    // renderText() {
    //     return <PublicArtText />;
    // }
    render() {
        return (
            // <div className="public-art-ui">
            <div className="public-art-ui" onClick={getPublicArtWithinMap}>
                <PublicArtText />
            </div>
        )
    }
}

class PublicArtControlDiv extends React.Component {

    render() {
        return <div className="public-art-control">
            <PublicArtUi />
        </div>
    }
}

export default PublicArtControlDiv;