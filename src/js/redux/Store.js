import {applyMiddleware, createStore, compose} from "redux"

import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducer from "./ReducerCombinator"

const middleware = applyMiddleware(promise(), thunk, logger());
const initialState = {
    sessionReducer: [
        {
            authenticated: localStorage.getItem('authenticated'),
            token: 'aaa',
            username: 'bbb',
            redirect: null,
            error: null,
            login_error: null
        }]
};

export default createStore(reducer,middleware);