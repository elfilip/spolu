/**
 * Created by elfilip on 10.8.17.
 */
import {combineReducers} from "redux";
import sessionReducer from "./SessionReducer";
import userReducer from "./UserReducer";
import rideReducer from './RideReducer';
const AddsReducers = combineReducers({
    sessionReducer,
    userReducer,
    rideReducer
});

export default AddsReducers;