import React from "react";
import {connect} from "react-redux"
import {withRouter} from 'react-router-dom'

import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import RideType from "../utils/RideType";

import {Link} from "react-router-dom"

class Ride extends React.Component {
    constructor() {
        super();
        this.state = {
            city: "",
            country: "",
            number: "",
            placeDescription: "",
            stopTime: "",
            street: "",
        }
    }

    handleKeydown(event) {
        let newState = {}
        newState[event.target.name] = event.target.value;
        this.setState(newState);
        let output = {...this.state};
        output[event.target.name] = event.target.value;
        this.props.update(output);
    }

    goToRideDetail() {
        this.props.history.push("/rideDetail")
    }

    getSection(sectionNo) {
        let index;
        for (index in this.props.ride.rideSections) {
            var section = this.props.ride.rideSections[index]
            if (section.sectionNo == sectionNo) {
                return section;
            }
        }
    }

    deleteRide(id){

    }

    applyRide(id){

    }

    signoffRide(id){

    }

    render() {
        const ride = this.props.ride;
        let isMiddle = false;
        let secFrom;
        let secTo;
        if (ride.rideSections.length == 1) {
            secFrom = ride.rideSections[0];
            secTo = ride.rideSections[0];
        } else {
            isMiddle = true;
            secFrom = this.getSection(0);
            secTo = this.getSection(1);
        }
        const detailURL = "/rideDetail?id=" + ride.id;
        return (
            <div>
                <h4>Jízda {ride.id}</h4>
                <b>Z</b> {secFrom.origin.city},{secFrom.origin.street}
                {isMiddle ? <span> <b> Pres </b> {secFrom.destination.city}, {secFrom.destination.street}</span> : ""}
                <b> Do</b> {secTo.destination.city},{secTo.destination.street} <br/>
                <b> Datum:</b> {secTo.origin.stopTime}<br/>
                <b> Kapacita </b> {ride.freeCapacity}/{ride.capacity}<br/>
                <Link to={detailURL}>Detail</Link><br/>
                {this.props.type == RideType.DRIVER ? <button onClick={this.deleteRide.bind(this,ride.id)}>Smazat</button> : "" }
                {this.props.type == RideType.HOST ? <button onClick={this.applyRide.bind(this,ride.id)}>Přihlásit</button> : "" }
                {this.props.type == RideType.SIT ? <button onClick={this.signoffRide.bind(this,ride.id)}>Odhlásit</button> : "" }
                <br/><br/>

            </div>)
    }
}

export default withRouter(connect(function (store) {
    return {}
})(Ride))
