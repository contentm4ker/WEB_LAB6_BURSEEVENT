import React, { Component } from 'react';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:80');

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

function modalHS(id) {
    var x = document.getElementById(id);
    if (x.style.display === 'block') {
        x.style.display='none'
    } else {
        x.style.display='block'
    }
}

const laws = ['равномерный', 'нормальный', 'биномиальный'];

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDataLoaded: false,
            startTime: null,
            endTime: null,
            deltaTime: null,
            brockers: null,
            stocks: null,
            error: null,
            timestamp: 'no timestamp yet'
        };

        this.backToLoginPage = this.backToLoginPage.bind(this);
        this.timeInputChanged = this.timeInputChanged.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:80/admin")
            .then(res => res.json())
            .then(
                (response) => {
                    this.setState({
                        isDataLoaded: true,
                        startTime: response.settings['start_time'],
                        endTime: response.settings['end_time'],
                        deltaTime: response.settings['delta_time'],
                        brockers: response.brockers,
                        stocks: response.stocks
                    });
                },
                (error) => {
                    this.setState({
                        error: error
                    });
                }
            );
        subscribeToTimer((err, timestamp) => this.setState({
            timestamp: timestamp.split('T')[1].split('.')[0]
        }));
    }
    
    timeInputChanged() {
        if (this.state.timestamp.slice(0,5) === this.state.startTime) {

        }
        if (this.state.timestamp.slice(0,5) === this.state.endTime) {

        }
    }
    
    backToLoginPage() {
        window.location.href='http://localhost:3000';
    }

    render() {
        let brockersTemplate;
        let stocksTemplate = [];
        let law = [0, 0, 0];
        if (this.state.isDataLoaded) {
            const brockersPart = this.state.brockers.map(function (item) {
                law = [0, 0, 0];
                const stocksPart = item.stocks.map(function (item) {
                    law[item.law] += item.amount;
                    return (
                        <div key={item.id}>
                            ID{item.id} в количестве {item.amount} цена каждой {item.price}$
                        </div>
                    );
                });
                stocksTemplate.push (
                    <div className="w3-modal" id={item.id} key={item.id}>
                        <div className="w3-modal-content w3-animate-zoom w3-card-4 w3-blue-grey" style={{width: '500px'}}>
                            <header className="w3-container w3-black">
                                <span className="w3-button w3-display-topright"
                                      onClick={modalHS.bind(this, item.id)}>
                                    &times;
                                </span>
                                <h2 className="w3-center">Акции брокера</h2>
                            </header>
                            <div className="w3-container">
                                {stocksPart}
                            </div>
                        </div>
                    </div>
                );
                return (
                    <>
                        <tr key={item.id}
                            onClick={modalHS.bind(this, item.id)}
                            style={{cursor: 'pointer'}}>

                            <td>{item.name}</td>
                            <td>{item.money}$</td>
                            <td>{law[0]}</td>
                            <td>{law[1]}</td>
                            <td>{law[2]}</td>
                            <td>0</td>

                        </tr>
                    </>
                );
            });
            brockersTemplate = (
                <div className="w3-container">
                    <table style={{width: '60%'}} className="w3-table-all">
                        <tbody>
                            <tr>
                                <th>Имя</th>
                                <th>Средства</th>
                                <th>Равномерные акции</th>
                                <th>Нормальные акции</th>
                                <th>Биномиальныее акции</th>
                                <th>Выставленно на продажу</th>
                            </tr>
                            {brockersPart}
                        </tbody>
                    </table>
                    {stocksTemplate}
                </div>
            );
        }
        return (
            <div className="Admin">
                <i
                    className="w3-margin-left w3-margin-top w3-display-topleft material-icons"
                    onClick={this.backToLoginPage}
                    style={{cursor: 'pointer'}}
                >arrow_back</i>
                {this.state.isDataLoaded ? brockersTemplate : 'Не удалось загрузить данные'}
                <input className="w3-display-topmiddle"
                       value={this.state.timestamp}
                       style={{'background-color': 'transparent',
                                'color': 'white',
                                'text-align': 'center'}}
                       onChange={this.timeInputChanged}
                       readOnly
                />
                <div className="w3-display-topright">
                    <div>Время начала торгов {this.state.startTime}</div>
                    <div>Время окончания торгов {this.state.endTime}</div>
                </div>
            </div>
        );
    }
}

export default Admin;