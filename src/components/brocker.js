import React, { Component } from 'react';

class Brocker extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.backToLoginPage = this.backToLoginPage.bind(this);
    }

    backToLoginPage() {
        window.location.href='http://localhost:3000';
    }

    render() {
        const iStyle = {
            cursor: 'pointer'
        };
        const {nickname, money} = this.props.user;

        return (
            <div className="Brocker">
                <i
                    className="w3-margin-left w3-margin-top w3-display-topleft material-icons"
                    onClick={this.backToLoginPage}
                    style={iStyle}
                >
                    arrow_back
                </i>
                <h1>
                    Brocker {nickname} with {money}$
                </h1>
            </div>
        );
    }
}

export default Brocker;