/**
 * Created by elfilip on 10.8.17.
 */
import RideType from '../utils/RideType'
import {hasUserRoleInRide} from "../utils/RideUtil";

export default function reducer(state = {
    rides: null,
    ride: null,
    ride_type: null,
    ride_isMiddle: null,
    rideBackId: null,
}, action) {
    switch (action.type) {
        case 'RIDES_LOADED':
            return {...state, rides: action.rides};
        case 'RIDE_LOADED':
            return {
                ride: {...action.ride},
                ride_isMiddle: action.ride.rideSections.length == 2,
                ride_type: updateState(action.userId, action.ride),
                rides: state.rides,
            };
        case 'CLEAR_RIDE':
            return {...state, ride: null};
        case 'RIDEBACK_LOADED':
            return {...state, rideBackId: action.rideBackId};

    }
    return state;
}


function updateState(userId, data) {
    if (hasUserRoleInRide(userId, data, RideType.DRIVER)) {
        return RideType.DRIVER;
    } else if (
        hasUserRoleInRide(userId, data, RideType.SIT)) {
        return RideType.SIT;
    } else {
        return RideType.HOST;
    }
}
