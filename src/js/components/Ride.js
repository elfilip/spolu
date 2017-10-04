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
import RideProfileImage from "./RideProfileImage";

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

    findDriver(ride){
        return RideUtil.findDriver(ride);
    }


    trimName(name, maxChars) {
        return RideUtil.trimName(name, maxChars);
    }

    computePrice(ride) {
       return  RideUtil.computePrice(ride);
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
        const maxLenght = 30;
        const detailURL = "/rideDetail?id=" + ride.id;
        return (

            <div class="ride">
                <div class="col-sm-3 col-md-2 col-lg-2" style={{textAlign:'center'}}>
                   <RideProfileImage profile={ride.driver}/>
                </div>
                <div class="col-sm-9 col-md-9 col-lg-9">
                    <div class="redStripeRide"/>
                    <div>
                        <div style={{float: 'right', textAlign: 'center'}}>
                            <div class="rideOverviewH4">Volná místa</div>
                            <span class="capacityOverview">{ride.freeCapacity}</span> z {ride.capacity}
                            <br/>
                            <br/>
                            <div class="rideOverviewH4">Cena</div>
                            <span class="capacityOverview">{this.computePrice(ride)}</span> Kč
                        </div>
                    </div>
                    <span class="glyphicon glyphicon-circle-arrow-right addressArrow greenColor"/><span class="address">{this.trimName(secFrom.origin.address, maxLenght)}</span><br/>
                    {isMiddle ? <span><span class="glyphicon glyphicon-circle-arrow-right addressArrow blueColor"/><span class="address">{this.trimName(secFrom.destination.address, maxLenght)} </span><br/></span> : ""}
                    <span class="glyphicon glyphicon-circle-arrow-left addressArrow redColor"/><span class="address">{this.trimName(secTo.destination.address, maxLenght)}</span> <br/>
                    <span class="glyphicon glyphicon-time addressArrow"/><span class="rideDate">{RideUtil.formatDate(secTo.origin.stopTime)}</span><br/>
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
