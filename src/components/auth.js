import React, { Component } from 'react';
import * as ReactDOM from "react-dom";
import {Redirect} from "react-router";

class Authorization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            inputValue: '',
            toBursePage: false,
            toAdminPage: false,
            userId: null
        };
        this.login = this.login.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.name).focus();
    }

    onTextChange(e) {
        this.setState({inputValue: e.target.value.trim(), error: null});
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.login();
        }
    }

    login(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.inputValue === 'admin') {
            this.setState({toAdminPage: true});
            return;
        }
        fetch(`http://localhost:80/login/${this.state.inputValue}`)
            .then(res => res.json())
            .then(
                (response) => {
                    if (response.status !== 200) {
                        this.setState({error: response.message});
                        return;
                    }
                    this.props.updateData(response);
                    this.setState({
                        toBursePage: true,
                        userId: response.id
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            );
    }

    render() {
        const divStyle = {
            width: '500px'
        };
        const error = this.state.error;
        if (this.state.toBursePage) {
            const ref = `/burse/${this.state.userId}`;
            return <Redirect to={ref} />;
        } else if (this.state.toAdminPage) {
            return <Redirect to="/admin" />;
        }
        return (
<div className="Auth">
    <div
        className='w3-container w3-half w3-display-middle'
        style={divStyle}
    >
        <h1>Авторизация</h1>
        <form className='w3-container w3-card-4'>
            <p>
                {error ? <label className='error w3-label w3-validate w3-red'> {error} Попробуйте еще раз.</label> : ''}
                <input
                    id='nickname'
                    className='w3-input'
                    type='text'
                    ref='name'
                    value={this.state.inputValue}
                    onChange={this.onTextChange}
                    onKeyPress={this.handleKeyPress}
                    required
                />
                <label className='w3-label w3-validate'>Введите ваше имя</label>
            </p>
            <p>
                <button
                    onClick={this.login}
                    className='w3-btn w3-padding w3-teal'
                    disabled={!this.state.inputValue}
                >
                    Войти
                </button>
            </p>
        </form>
    </div>
</div>
        );
    }
}

export default Authorization;