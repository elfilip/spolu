/**
 * Created by elfilip on 10.8.17.
 */
import axios from 'axios';
import {loginRedirect} from "./SessionAction"
import Constants from "../utils/Constants";

export function register(user) {
    return function (dispatch) {
        const config = {};
        axios.post(Constants.baseURL + '/users', user, config)
            .then(function (response) {
                dispatch({type: 'REGISTER', user: user, activationToken: response.data.token})
            })
            .catch(function (error) {
                dispatch({type: 'SET_ERROR', error: "Can't register. " + error.status})
            })
    }
}

export function getProfile(userId) {
    return function (dispatch) {
        const config = {};
        dispatch({type: 'PROFILE_LOADING'})
        axios.get(Constants.baseURL + '/user/'+userId)
            .then(function (response) {
                dispatch({type: 'GET_USER', profile: response.data})
                dispatch({type: 'PROFILE_LOADED'})
            })
            .catch(function (error) {
                dispatch({type: 'SET_ERROR', error: "Can't get user. " + error.status})
            })
    }
}

