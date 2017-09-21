import React from "react";
import {connect} from "react-redux"
import {withRouter} from 'react-router-dom'

import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import RideType from "../utils/RideType";

import {Link} from "react-router-dom"
import * as RideUtil from "../utils/RideUtil";

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

    deleteRide(id) {

    }

    applyRide(id) {

    }

    signoffRide(id) {

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

            <div class="ride">
                <div class="col-sm-3 col-md-3 col-lg-3">
                    Tady bude obrazek
                </div>
                <div class="col-sm-9 col-md-9 col-lg-9">
                    <div class="redStripeRide"/>
                    <span class="address">{secFrom.origin.address} </span><span class="glyphicon glyphicon-arrow-right addressArrow"/>
                    {isMiddle ? <span><span class="address"> {secFrom.destination.address} </span><span class="glyphicon glyphicon-arrow-right addressArrow"/></span> : ""}
                    <span class="address"> {secTo.destination.address}</span> <br/>
                    <span class="rideDate">{RideUtil.formatDate(secTo.origin.stopTime)}</span><br/>
                    <b> Kapacita </b> {ride.freeCapacity}/{ride.capacity}<br/>
                    <Link to={detailURL}>Zobrazit Detail</Link><br/>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="rideStripe"/>
                </div>
            </div>)
    }
}

export default withRouter(connect(function (store) {
    return {}
})(Ride))
