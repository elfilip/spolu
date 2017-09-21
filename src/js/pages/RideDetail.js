import React from "react";
import {connect} from "react-redux"
import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import queryString from "query-string";
import Participant from "../components/Participant";
import Address from "../components/Address";
import RideType from "../utils/RideType";
import Ride from "../components/Ride";
import {deleteRide, addUserToRide, deleteUserFromRide, loadRide, clearRide} from "../redux/RideAction";

class RideDetail extends React.Component {
    constructor() {
        super();
        this.state = {
            id: null,
        }
    }

   componentDidUpdate(){
        let queryParams = queryString.parse(this.props.location.search);
        if(queryParams.id != this.state.id) {
            this.props.dispatch(loadRide(this.props.userId, queryParams.id));
            this.setState({id: queryParams.id})
        }
    }

    componentWillMount() {
        let queryParams = queryString.parse(this.props.location.search);
        this.props.dispatch(loadRide(this.props.userId, queryParams.id));

    }

    loadRide(rideId) {
        axios.get(Constants.baseURL + '/ride/' + rideId)
            .then(function (response) {
                this.updateState(response.data);
            }.bind(this))
            .catch((error) => {
                this.props.dispatch({type: 'SET_ERROR', error: "Can't get ride. " + error.status})
                console.log(error)
            })
    }

    updateState(data) {
        var type;
        if (this.isCurrentUserDriver(data)) {
            type = RideType.DRIVER;
        } else if (
            this.isCurrentUserParticipant(data)) {
            type = RideType.SIT;
        } else {
            type = RideType.HOST;
        }

        this.setState({ride: data, isMiddle: data.rideSections.length == 2, type: type});

    }

    handleKeydown(event) {
        let newProfile = this.state.profile;
        newProfile[event.target.name] = event.target.value;
        this.setState({profile: newProfile});
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    submit(event) {
        this.setProfile();
    }


    getSection(ride, sectionNo) {
        let index;
        for (index in ride.rideSections) {
            var section = ride.rideSections[index]
            if (section.sectionNo == sectionNo) {
                return section;
            }
        }
    }

    removeRide() {
        this.props.dispatch(deleteRide(this.props.ride.id))
    }

    applyRide(section) {
        if(section != -1)
        this.props.dispatch(addUserToRide(this.props.ride.id, this.props.userId, section, RideType.SIT));
        else{
            this.props.dispatch(addUserToRide(this.props.ride.id, this.props.userId, null, RideType.SIT));
        }
        this.setState({})
    }

    signoffRide() {
        this.props.dispatch(deleteUserFromRide(this.props.ride.id, this.props.userId));
    }

    render() {
        console.log("rideDetail rendering");
        if (!this.props.ride) {
            return <div></div>
        }
        let ride = this.props.ride;
        let origin;
        let middle;
        let destination;
        let participants1;
        let participants2;
        let applyButton1;
        let applyButton2;
        let applyButton3;

        if (!this.props.isMiddle) {
            origin = this.getSection(ride, 0).origin;
            destination = this.getSection(ride, 0).destination;
            participants1 = this.getSection(ride, 0).participants.map(function (participant) {
                return <Participant key={participant.userId} participant={participant}/>
            })
            applyButton1= <button onClick={this.applyRide.bind(this, 0)}>Přihlásit se k jízdě</button>
        } else {
            origin = this.getSection(ride, 0).origin;
            destination = this.getSection(ride, 1).destination;
            middle = this.getSection(ride, 0).destination;
            participants1 = this.getSection(ride, 0).participants.map(function (participant) {
                return <Participant key={participant.userId} participant={participant}/>
            })
            participants2 = this.getSection(ride, 1).participants.map(function (participant) {
                return <Participant key={participant.userId} participant={participant}/>
            })
            applyButton1= <button onClick={this.applyRide.bind(this, 0)}>Přihlásit se trase {origin.city}, {origin.street} -> {middle.city}, {middle.street}</button>
            applyButton2= <button onClick={this.applyRide.bind(this, 1)}>Přihlásit se k trase {middle.city}, {middle.street} -> {destination.city},{destination.street}</button>
            applyButton3= <button onClick={this.applyRide.bind(this, -1)}>Přihlásit se na celou trasu</button>
        }
        return (
            <div>
                <div class="container">
                    <div class="row">
                        <div class="col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">

                            <div class="panel-default">
                                <div class="panel-heading"><h4>Nástup a výstup</h4></div>
                                <div class="panel-body">
                                    <Address name="Začátek trasy" data={origin.address}/>
                                    {this.props.isMiddle ? <Address name="Mezizastávka trasy" data={middle.address}/> : ""}
                                    <Address name="Konec trasy" data={destination.address}/>>
                                </div>
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
        ride: store.rideReducer.ride,
        type: store.rideReducer.ride_type,
        isMiddle: store.rideReducer.ride_isMiddle,
    }
})(RideDetail)
