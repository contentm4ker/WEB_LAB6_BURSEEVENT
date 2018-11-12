import React, { Component } from 'react';

class Brocker extends Component {
    render() {
        const {nickname, money} = this.props.user;
        return (
            <h1>
                Brocker {nickname} with {money}$
            </h1>
        );
    }
}

export default Brocker;