import React, { Component } from 'react';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:80');

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

class Admin extends Component {

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


        return (
            <div className="Admin">
                <i
                    className="w3-margin-left w3-margin-top w3-display-topleft material-icons"
                    onClick={this.backToLoginPage}
                    style={iStyle}
                >
                    arrow_back
                </i>
                <h1>Admin</h1>
            </div>
        );
    }
}

export default Admin;