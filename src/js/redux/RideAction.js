/**
 * Created by elfilip on 10.8.17.
 */
import axios from 'axios';
import {loginRedirect} from "./SessionAction"
import Constants from "../utils/Constants";

import { createHashHistory } from 'history';
const history = createHashHistory()

export function loadUserRides(userId) {
    return function (dispatch) {
        axios.get(Constants.baseURL + '/user/' + userId + '/rides')
            .then(function (response) {
                dispatch({type: 'RIDES_LOADED', rides: response.data});
            })
            .catch(function (error) {
                dispatch({type: 'SET_ERROR', error: "Nelze načíst jízdy. " + error.status});
                console.log(error);
            })
    }
}

export function loadRide(userId, rideId) {
    return function (dispatch) {
        axios.get(Constants.baseURL + '/ride/' + rideId)
            .then(function (response) {
                dispatch({type: 'RIDE_LOADED', ride: response.data , userId: userId});
            }.bind(this))
            .catch((error) => {
                dispatch({type: 'SET_ERROR', error: "Can't get ride. " + error.status})
                dispatch({type: 'CLEAR_RIDE'})

                console.log(error)
            })
    }
}

export function addUserToRide(rideId, userId, sectionNo, role) {
    return function (dispatch) {
        const config = {headers: {'Content-Type': 'application/json'}};
        var queryParams = "?userId=" + userId + "&role=" + role;
        if (sectionNo) {
            queryParams = queryParams + "&sectionNo=" + sectionNo;
        }
        axios.post(Constants.baseURL + '/ride/' + rideId + '/participants' + queryParams, null, config)
            .then(function (response) {
                dispatch({type: 'SET_OK_MESSAGE', message: 'Jste příhlášen k jízdě.'});
                dispatch(loadUserRides(userId,rideId));
                dispatch(loadRide(userId,rideId));
                history.push('/myRides');
            })
            .catch(function (error) {
                dispatch({type: 'SET_ERROR', error: "Nelze vás příhlásit k jízdě.. " + error.status});
                console.log(error);
            })
    }
}

export function deleteUserFromRide(rideId, userId) {
    return function (dispatch) {
        axios.delete(Constants.baseURL + '/ride/' + rideId + '/participant/' + userId)
            .then(function (response) {
                dispatch({type: 'SET_OK_MESSAGE', message: 'Jste odhlášen z jízdy.'});
                dispatch(loadUserRides(userId,rideId));
                dispatch(loadRide(userId,rideId));
                history.push('/myRides');
            })
            .catch(function (error) {
                dispatch({type: 'SET_ERROR', error: "Nelze vás odhlásit z jízdy. " + error.status});
                console.log(error);
            })
    }
}

export function deleteRide(rideId) {
    return function (dispatch) {
        axios.delete(Constants.baseURL + '/ride/' + rideId)
            .then(function (response) {
                dispatch({type: 'SET_OK_MESSAGE', message: 'Jízda smazána.'});
                dispatch(loadUserRides());
                history.push('/myRides');
            })
            .catch(function (error) {
                dispatch({type: 'SET_ERROR', error: "Nelze smazat jízdu. " + error.status});
                console.log(error);
                history.push('/myRides');
            })
    }
}

export function clearRide() {

return {type: 'CLEAR_RIDE'};
}


