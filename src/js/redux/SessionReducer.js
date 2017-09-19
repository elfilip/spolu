export default function reducer(state = {
    username: localStorage.getItem('username'),
    authenticated: (localStorage.getItem('authenticated') == 'true'),
    redirect: null,
    error: null,
    login_error: null,
    userId: localStorage.getItem('userId'),
    ok_message: null,
}, action) {
    switch (action.type) {
        case 'LOGIN' :
            return {...state, username: action.username, token: action.username + '123', userId: action.userId, authenticated: true, error: null, login_error: null,ahoj: true};
        case 'LOGOUT' :
            return {...state, username: null, token: null, authenticated: false, error: null, redirect: null, login_error: null}
        case 'REDIRECT':
            return {...state, url: action.url}
        case "SET_ERROR" :
            return {...state, error: action.error}
        case 'STATE_CLEAN':
            return {...state, redirect: null, error: null, ok_message:null}
        case 'SET_LOGIN_ERROR':
            return {...state, redirect: null, login_error: action.error}
        case 'SET_OK_MESSAGE':
            return {...state, ok_message: action.message}
    }
    return state;
}
/**
 * Created by elfilip on 14.8.17.
 */

/*
username: localStorage.getItem('username'),
    token: "xx",
    authenticated: localStorage.getItem('authenticated'),
    redirect: null,
    error: null,
    login_error: null,
    userId: localStorage.getItem('userId'),
    ok_message: null,*/