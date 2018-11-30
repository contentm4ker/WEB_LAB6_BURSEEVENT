import React, { Component } from 'react';
import openSocket from "socket.io-client";

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

class Brocker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            timestamp: '',
            startTime: null,
            endTime: null,
            stocks: null,
            money: null,
            isDataLoaded: false,
            stocksInSelling: null
        };
        this.backToLoginPage = this.backToLoginPage.bind(this);
        this.onSell = this.onSell.bind(this);
        this.onBuy = this.onBuy.bind(this);
    }

    componentDidMount() {
        let initArr = [];
        this.setState({
            money: this.props.user.money,
            stocksInSelling: initArr
        });
        subscribeToTimer((err, timestamp) => this.setState({
            timestamp: timestamp.split('T')[1].split('.')[0]
        }));

        socket.emit('hello', this.props.user.id);

        socket.on('setSellsThings', data => {
            if (this.state.id === null || this.state.id === data.id) {
                this.setState({
                    id: data.id,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    stocks: data.stocks,
                    isDataLoaded: true
                });
            }
        });

        socket.on('startSelling', () => {

        });

        socket.on('stopSelling', () => {

        });

        socket.on('addStocks', (data) => {
            let tmp = this.state.stocksInSelling;
            tmp.push(data);
            this.setState({
                stocksInSelling: tmp
            });
        });

        socket.on('delStocks', (data) => {
            if (Number(data.userID) === this.state.id) {
                this.setState({
                    money: this.state.money + data.price * data.amount
                });
            }
            let tmp = this.state.stocksInSelling;
            tmp.splice(data.ind, 1);
            this.setState({
                stocksInSelling: tmp
            });
        });
    }

    componentWillUnmount() {
    }

    onSell(id) {
        modalHS(id);
        let val = document.getElementById('inp'+id).value;
        if (Number(val) <= 0) {
            alert('Неправильное количество акций!');
            return;
        }
        let isZeroAmount = false;
        let userID = this.state.id;
        let nickname = this.props.user.nickname;
        let isBigger = true;
        let stocks = this.state.stocks.map(function (item) {
            if (item.id === Number(id)) {
                if (item.amount < Number(val)) {
                    isBigger = false;
                }
                if (isBigger) {
                    item.amount -= Number(val);
                    if (item.amount === 0) {
                        isZeroAmount = true;
                    }
                    socket.json.emit('addStocks', {
                        'id': Number(id),
                        'amount': Number(val),
                        'price': item.price,
                        'law': Number(item.law),
                        'userID': userID,
                        'name': nickname
                    });
                }
            }
            return item;
        });

        if (isBigger) {
            this.setState({
                stocks: stocks
            });
            if (isZeroAmount) {
                let tmp = [];
                for (let i = 0; i < this.state.stocks.length; i++) {
                    if (this.state.stocks[i].amount !== 0) {
                        tmp.push(this.state.stocks[i]);
                    }
                }
                this.setState({
                    stocks: tmp
                });
            }
        } else {
            alert('Неккоректное количество акций!')
        }
    }

    onBuy(stock, ind) {
        if (this.state.money >= stock.amount * stock.price) {
            let isChanged = false;
            this.setState({
                stocks: this.state.stocks.map(function (item) {
                    if (item.id === stock.id) {
                        item.amount += stock.amount;
                        isChanged = true;
                    }
                    return item;
                }),
                money: this.state.money - stock.price * stock.amount
            });

            socket.json.emit('delStocks', {
                'ind': ind,
                'userID': stock.userID,
                'price': stock.price,
                'amount': stock.amount,
                'id': stock.id,
                'law': stock.law,
                'buyerID': this.state.id
            });

            if (!isChanged) {
                let tmp = this.state.stocks;
                delete stock.userID;
                delete stock.name;
                tmp.push(stock);
                this.setState({
                    stocks: tmp
                });
            }
        } else {
            alert("У Вас недостаточно средств")
        }
    }

    backToLoginPage() {
        socket.emit('disct', this.props.user.id);
        window.location.href='http://localhost:3000';
    }

    render() {
        const nickname = this.props.user.nickname;
        let law_num = [0, 0, 0];
        let law_price = [0, 0, 0];
        let stocksLawSeparation;
        let stockTemplate;
        let stockModals = [];
        let stocksInSelling;
        let stockModalsForBuy = [];
        const onBuy = this.onBuy;
        if (this.state.isDataLoaded && this.state.stocksInSelling.length !== 0) {
            const stocksInSellingPart = this.state.stocksInSelling.map(function (item, index) {
                stockModalsForBuy.push(
                    <div className="w3-modal" id={'buymodal' + item.id + String(index)} key={item.id}>
                        <div className="w3-modal-content w3-animate-zoom w3-card-4 w3-blue-grey" style={{width: '500px'}}>
                            <header className="w3-container w3-black">
                                <span className="w3-button w3-display-topright"
                                      onClick={modalHS.bind(this, 'buymodal' + item.id + String(index))}>
                                    &times;
                                </span>
                                <h2 className="w3-center">Покупка</h2>
                            </header>
                            Вы уверены что хотите приобрести данные акции?
                            <button className="w3-button w3-block w3-black w3-section w3-padding"
                                    onClick={onBuy.bind(this, item, index)}
                            >
                                Приобрести
                            </button>
                        </div>
                    </div>
                );
                return (
                    <tr key={item.id}
                        onClick={modalHS.bind(this, 'buymodal' + item.id + String(index))}
                        style={{cursor: 'pointer'}}>

                        <td>{item.userID} {item.name}</td>
                        <td>{item.id}</td>
                        <td>{laws[item.law]}</td>
                        <td>{item.amount} шт.</td>
                        <td>{item.price}$</td>
                        <td>{item.price * item.amount}$</td>
                    </tr>
                );
            });
            stocksInSelling = (
                <div className="w3-container w3-display-right">
                    <table className="w3-table-all w3-large w3-centered">
                        <tbody>
                        <tr>
                            <th>Брокер</th>
                            <th>ID</th>
                            <th>Закон распределения</th>
                            <th>Количество</th>
                            <th>Цена за штуку</th>
                            <th>Общая цена</th>
                        </tr>
                        {stocksInSellingPart}
                        </tbody>
                    </table>
                </div>
            );
        }
        if (this.state.isDataLoaded) {
            const onSell = this.onSell;
            const stocksPart = this.state.stocks.map(function (item) {
                law_num[item.law] += item.amount;
                law_price[item.law] += item.amount * item.price;
                stockModals.push(
                    <div className="w3-modal" id={item.id} key={item.id}>
                        <div className="w3-modal-content w3-animate-zoom w3-card-4 w3-blue-grey" style={{width: '500px'}}>
                            <header className="w3-container w3-black">
                                <span className="w3-button w3-display-topright"
                                      onClick={modalHS.bind(this, item.id)}>
                                    &times;
                                </span>
                                <h2 className="w3-center">Кол-во акций на продажу</h2>
                            </header>
                            <label><b>Кол-во акций:</b>
                                <input placeholder="количество" id={'inp'+item.id}
                                       className="w3-input w3-border w3-margin-bottom"
                                       type="number"
                                       min={1}
                                       max={item.amount}
                                />
                            </label>
                            <button className="w3-button w3-block w3-black w3-section w3-padding"
                                    onClick={onSell.bind(this, item.id)}
                            >
                                Выставить на продажу
                            </button>
                        </div>
                    </div>
                );
                return (
                    <tr key={item.id}
                        onClick={modalHS.bind(this, item.id)}
                        style={{cursor: 'pointer'}}>

                        <td>{item.id}</td>
                        <td>{laws[item.law]}</td>
                        <td>{item.amount} шт.</td>
                        <td>{item.price}$</td>
                        <td>{item.amount * item.price}$</td>

                    </tr>
                );
            });

            stocksLawSeparation = (
                <table className="w3-table-all w3-large w3-centered">
                    <tbody>
                    <tr>
                        <th></th>
                        <th>Количество</th>
                        <th>Суммарная стоимость</th>
                    </tr>
                    <tr>
                        <th>Равномерный закон</th>
                        <td>{law_num[0]}</td>
                        <td>{law_price[0]}</td>
                    </tr>
                    <tr>
                        <th>Нормальный закон</th>
                        <td>{law_num[1]}</td>
                        <td>{law_price[1]}</td>
                    </tr>
                    <tr>
                        <th>Биномиальный закон</th>
                        <td>{law_num[2]}</td>
                        <td>{law_price[2]}</td>
                    </tr>
                    </tbody>
                </table>
            );
            stockTemplate = (
                <div className="w3-container w3-display-left">
                    <table className="w3-table-all w3-large w3-centered">
                        <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Закон распределения</th>
                            <th>Количество</th>
                            <th>Цена за штуку</th>
                            <th>Общая цена</th>
                        </tr>
                        {stocksPart}
                        </tbody>
                    </table>
                    <br/>
                    {stocksLawSeparation}
                </div>
            );
        }

        return (
            <div className="Brocker">
                <i
                    className="w3-margin-left w3-margin-top w3-display-topleft material-icons"
                    onClick={this.backToLoginPage}
                    style={{cursor: 'pointer'}}
                >
                    arrow_back
                </i>
                {this.state.isDataLoaded ?
                <>
                    <div className="w3-container w3-display-topmiddle">
                        <input value={this.state.timestamp}
                               style={{backgroundColor: 'transparent',
                                   color: 'white',
                                   textAlign: 'center'}}
                               readOnly
                        />
                        <h1>
                            Brocker {nickname} with {this.state.money}$
                        </h1>
                    </div>
                        <div className="w3-display-topright">
                        <div>Время начала торгов {this.state.startTime}</div>
                        <div>Время окончания торгов {this.state.endTime}</div>
                    </div>
                    {stockTemplate}
                    {stockModals}
                </>
                : ''}
                {this.state.isDataLoaded && this.state.stocksInSelling.length !== 0 ? stocksInSelling : ''}
                {this.state.isDataLoaded && this.state.stocksInSelling.length !== 0 ? stockModalsForBuy : ''}
            </div>
        );
    }
}

export default Brocker;