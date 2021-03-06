import React from "react";
import {connect} from "react-redux"
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import Ride from '../components/Ride'
import {loadUserRides} from "../redux/RideAction";
import RideType from "../utils/RideType";
import {hasUserRoleInRide} from "../utils/RideUtil";

class MyRides extends React.Component {
    constructor() {
        super();
        this.state = {
            rides: null,
            driver: true,
        }
    }

    componentWillMount() {
        this.loadRides();
    }

    loadRides() {
        this.props.dispatch(loadUserRides());
    }

    buttonClick(value) {
        this.setState({driver: value});
    }

    render() {
        var driver = [];
        var sit = [];


        var length = this.props.rides ? this.props.rides.userRideList.length
            : null;
        console.log("rendering myRides " + length);
        let html = <div>Loading...</div>

        if (this.props.rides_driver != null) {
            this.props.rides_driver.userRideList.map(function (ride) {
                driver.push(<Ride key={ride.id} ride={ride} type={RideType.DRIVER}/>)
            }.bind(this));
        }
        if(this.props.rides_participant != null){
            this.props.rides_participant.userRideList.map(function (ride) {
                sit.push(<Ride key={ride.id} ride={ride} type={RideType.SIT}/>)
            }.bind(this));        }

        var button1class = this.state.driver ? "myRideButtonActive btnRide btn-primaryRide" : "btnRide btn-primaryRide";
        var button2class = this.state.driver ? "btnRide btn-primaryRide" : "myRideButtonActive btnRide btn-primaryRide";

        var rideList = this.state.driver ? driver : sit;

        return (
            <div class="container">

                <div class="row">
                    <div class="col-sm-8 col-sm-offset-2 col-md-10 col-md-offset-1 col-lg-6 col-lg-offset-3" style={{textAlign: 'center'}}>
                        <div class="btn-group">
                            <button type="button" onClick={this.buttonClick.bind(this, true)} class={button1class}>Jízdy kde jsem řidič</button>
                            <button type="button" onClick={this.buttonClick.bind(this, false)} class={button2class}>Jízdy kde jsem spolujezec</button>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div class="col-sm-12 col-sm-offset-0 col-md-12 col-md-offset-0 col-lg-10 col-lg-offset-1">
                        <div class="panel-default">
                            <div class="panel-heading"><h4>{this.state.driver ? "Jízdy, kde jsem řidič" : "Jízdy, kde jsem spolujezdec"}</h4></div>
                            <div class="panel-body">
                                {rideList.length != 0 ? rideList : <h3>Žádné jízdy k zobrazení.</h3>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default connect(function (store) {
    return {
        userId: store.sessionReducer.userId,
        rides_driver: store.rideReducer.rides_driver,
        rides_participant: store.rideReducer.rides_participant,
    }
})(MyRides)
