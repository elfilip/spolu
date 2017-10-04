/**
 * Created by elfilip on 10.8.17.
 */
import axios from 'axios';
import Constants from "../utils/Constants";
import { createHashHistory } from 'history';
import {handleError} from "../utils/RideUtil";

const history = createHashHistory()

export function login(username, userId) {
    localStorage.setItem('authenticated',true);
    localStorage.setItem('username',username);
    localStorage.setItem('userId', userId)
    return {type: 'LOGIN', username: username, userId: userId}
}

export function logout() {
    const config = {};
    return function (dispatch) {
        axios.post(Constants.baseURL + '/users/logout', config)

            .then(function (response) {
                dispatch({type: 'LOGOUT'})
                history.push('/login')
                localStorage.clear();
            })
            .catch(function (error) {
                console.error("Nepovedlo se odlhásit");
                console.error(error);
                dispatch({type: 'LOGOUT'})
            })
    }

}

export function loginRequest(username, password) {
    // const config = {headers: {'Content-Type': 'multipart/form-data'}};
    return function (dispatch) {
        const config = {headers: {'Content-Type': 'application/json'}};
        axios.post(Constants.baseURL + '/users/login',
            {
                email: username,
                password: password,
            }, config)
            .then(function (response) {
                loadCurrentProfileAndLogin(dispatch);
            })
            .catch(function (error) {
                dispatch({type: 'SET_LOGIN_ERROR', error: "Špatné jméno nebo heslo."})
                console.log(error);
            })
        return {type: 'xxxx'}
    }
}

export function clearLoginMessage(){
    return function (dispatch){
        dispatch({type: 'CLEAR_LOGIN_MESSAGE'});
    }
}

function loadCurrentProfileAndLogin(dispatch){
    axios.get(Constants.baseURL + '/user')
        .then(function (response) {
            dispatch(login(response.data.email, response.data.id));
            history.push('/main')
        })
        .catch(function (error) {
            handleError(dispatch, "Nepovedlo se přihlásit. Nepovedlo se načíst uživatele", error);
        })
}

export function setOKMessage(message){
    return {type:'SET_OK_MESSAGE', message: message}
}

export function redirect(url) {
    console.log("redirect " + url)
    return {type: 'REDIRECT', url: url};
}

export function clear() {
    return {type: 'STATE_CLEAN'}
}
