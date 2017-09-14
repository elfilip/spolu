import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import Base from "./pages/Base"

import store from "./redux/Store";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {HashRouter as Router} from "react-router-dom";

const app = document.getElementById('app');


ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider>
            <Router>
            <Base/>
            </Router>
        </MuiThemeProvider>
    </Provider>,
    app);
