/**
 * Created by elfilip on 10.8.17.
 */
import axios from 'axios';
import {loginRedirect} from "./SessionAction"
import Constants from "../utils/Constants";

import { createHashHistory } from 'history';
import {handleError} from "../utils/RideUtil";
const history = createHashHistory()

export function loadUserRides() {
    return function (dispatch) {
        axios.get(Constants.baseURL + '/user/rides/drives')
            .then(function (response) {
                dispatch({type: 'RIDES_DRIVER_LOADED', rides: response.data});
            })
            .catch(function (error) {
                handleError(dispatch, "Nelze načíst jízdy řidiče", error);
            })
        axios.get(Constants.baseURL + '/user/rides/participates')
            .then(function (response) {
                dispatch({type: 'RIDES_PARTICIPANT_LOADED', rides: response.data});
            })
            .catch(function (error) {
                handleError(dispatch, "Nelze načíst jízdy účastníka", error);

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
                dispatch({type: 'CLEAR_RIDE'})
                handleError(dispatch, "Nelze načíst jízdu", error);
            })
          }
}

export function addUserToRide(rideId, userId, sectionNo) {
    return function (dispatch) {
        const config = {headers: {'Content-Type': 'application/json'}};
        axios.post(Constants.baseURL + '/ride/' + rideId + '/participants', {sectionNo: sectionNo}, config)
            .then(function (response) {
                dispatch({type: 'SET_OK_MESSAGE', message: 'Jste příhlášen k jízdě.'});
                dispatch(loadUserRides(userId,rideId));
                dispatch(loadRide(userId,rideId));
                history.push('/myRides');
            })
            .catch(function (error) {
                handleError(dispatch, "Nelze vás příhlásit k jízdě", error);
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
                handleError(dispatch, "Nelze vás odhlásit z jízdy", error);
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
                handleError(dispatch, "Nelze smazat jízdu", error);
            })
    }
}

export function clearRide() {

return {type: 'CLEAR_RIDE'};
}


