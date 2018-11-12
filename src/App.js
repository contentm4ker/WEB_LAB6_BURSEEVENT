import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import './App.css';
import NotFound from './components/notfound'
import Admin from './components/admin'
import Authorization from './components/auth'
import Brocker from './components/brocker'


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
        this.updateData = this.updateData.bind(this);
    }

    updateData(value) {
        this.setState({ user: value });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/"
                                   render={() =>
                                       <Authorization
                                           updateData={this.updateData}
                                       />}
                            />
                            <Route exact path="/burse/:id"
                                   render={() =>
                                       <Brocker
                                            user={this.state.user}
                                       />}
                            />
                            <Route exact path="/admin" component={Admin} />
                            <Route component={NotFound} />
                        </Switch>
                    </BrowserRouter>
                </header>
            </div>
        );
  }
}

export default App;
