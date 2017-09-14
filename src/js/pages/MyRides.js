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
        }
    }

    componentWillMount() {
        this.loadRides();
    }

    loadRides() {
        this.props.dispatch(loadUserRides(this.props.userId));
    }

    render() {
        var driver = [];
        var sit = [];


        var length = this.props.rides ? this.props.rides.userRideList.length
            : null;
        console.log("rendering myRides " + length);
        let html = <div>Loading...</div>
        if (this.props.rides !== null) {
            this.props.rides.userRideList.map(function (ride) {
                if (hasUserRoleInRide(this.props.userId, ride, RideType.DRIVER))
                    driver.push(<Ride key={ride.id} ride={ride} type={RideType.DRIVER}/>);
                else if (hasUserRoleInRide(this.props.userId, ride, RideType.SIT)) {
                    sit.push(<Ride key={ride.id} ride={ride} type={RideType.SIT}/>);
                }
            }.bind(this))
        }
        return (
            <div>
                <h1>Moje jízdy</h1>
                <h2>Jízdy kde jsem řidič</h2>
                {driver.length != 0 ? driver : 'Nemáte žádné jízdy, kde by jste byl(a) řidič.'}
                <h2>Jízdy kde jsem spolujezec</h2>
                {sit.length != 0 ? sit : 'Nemáte žádné jízdy, kde by jste byl(a) spolujezdec.'}
            </div>)
    }
}

export default connect(function (store) {
    return {
        userId: store.sessionReducer.userId,
        rides: store.rideReducer.rides,
    }
})(MyRides)
