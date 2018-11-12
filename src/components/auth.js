import React, { Component } from 'react';
import * as ReactDOM from "react-dom";
import {Redirect} from "react-router";

class Authorization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isAuth: false,
            inputValue: '',
            toBursePage: false
        };
        this.login = this.login.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.name).focus();
    }

    onTextChange(e) {
        this.setState({inputValue: e.target.value.trim()});
    }

    login(e) {
        e.preventDefault();
        fetch(`http://localhost:80/${this.state.inputValue}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isAuth: true
                    });
                    this.props.updateData(result);
                    this.setState({toBursePage: true});
                },
                (error) => {
                    this.setState({
                        isAuth: false,
                        error
                    });
                }
            );
    }

    render() {
        const divStyle = {
            width: '500px'
        };
        const { name, error } = this.props;
        if (this.state.toBursePage)
            return <Redirect to='/burse' />;
        return (
            <div className="Auth">
                <div
                    className='w3-container w3-half w3-display-middle'
                    style={divStyle}
                >
                    <h1>Авторизация</h1>
                    <form className='w3-container w3-card-4'>
                        <p>
                            {error ? <label className='error w3-label w3-validate w3-red'> {error}. <br /> Попробуйте еще раз.</label> : ''}
                            <input
                                id='nickname'
                                className='w3-input'
                                type='text'
                                ref='name'
                                value={this.state.inputValue}
                                onChange={this.onTextChange}
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