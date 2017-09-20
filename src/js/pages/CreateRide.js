import React from "react";
import {connect} from "react-redux"
import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import Address from '../components/Address'
import {loadUserRides} from "../redux/RideAction";

class CreateRide extends React.Component {
    constructor() {
        super();
        this.state = {
                capacity: 0,
                isMiddle: false,
                origin: {},
                middleStop: {},
                destination: {},
                price1: 0,
                price2: 0,
                regularity: 0,
                isRideBack: false,
                originStopTime: "",
                middleStopTime: "",
                destinationTime: "",
                rideType: "",
        }
    }

    componentWillMount() {

    }

    handleKeydown(event) {
        let newState = {}
        if (event.target.type == 'checkbox') {
            newState[event.target.name] = event.target.checked;
        } else {
            newState[event.target.name] = event.target.value;
        }
        this.setState(newState);
    }

    updateOrigin(address) {
        this.setState({origin: address})
    }

    updateMiddle(address) {
        this.setState({middleStop: address})
    }

    updateDest(address) {
        this.setState({destination: address})
    }

    submit() {
        let ride = {};
        ride['capacity'] = this.state.capacity;
        ride['origin'] = this.state.origin;
        if (this.state.isMiddle)
            ride['middleStop'] = this.state.middleStop;
        ride['destination'] = this.state.destination;
        ride['price1'] = this.state.price1;
        if (this.state.isMiddle)
            ride['price2'] = this.state.price2;
        ride['regularity']=this.state.regularity;
        ride['rideType']=this.state.rideType;
        ride['detour']=false;
        if(this.state.isRideBack) {
            let rideBack = {
                destinationTime: this.state.destinationTime,
                middleStopTime: this.state.middleStopTime,
                originStopTime: this.state.originStopTime
            }
            ride['rideBack']=rideBack;
        }
        const config = {headers: {'Content-Type': 'application/json'}};
        axios.post(Constants.baseURL + '/rides', ride,config)
            .then(function (response) {
                this.props.dispatch(loadUserRides(this.props.userId));
                this.props.dispatch(setOKMessage("Jízda vytvořena."))
            }.bind(this))
            .catch(function (error) {
                this.props.dispatch({type: 'SET_ERROR', error: "Nelze vytvořit jízdu. " + error.status})
                console.log(error)
            }.bind(this))




    }

    render() {
        return (
            <div>
                <div class="container">
                    <div class="row">
                        <div class="col-sm-8 col-sm-offset-2 col-md-10 col-md-offset-1 col-lg-6 col-lg-offset-3">
                <h1>Vytvoření Jízdy</h1>
                Kapacita: <input type="text" value={this.state.capacity} onChange={this.handleKeydown.bind(this)} name="capacity"/>
                <Address name="Začátek trasy" update={this.updateOrigin.bind(this)}/>
                Vytvořit mezizastávku: <input type="checkbox" onChange={this.handleKeydown.bind(this)}
                                              value={this.state.isMiddle} name="isMiddle"/>
                {this.state.isMiddle ? <Address name="Mezizastávka trasy" update={this.updateMiddle.bind(this)}/> : ""}
                <Address name="Konec trasy" update={this.updateDest.bind(this)}/>
                <br/>
                <br/>
                Cena za první úsek: <input type="text" name="price1" onChange={this.handleKeydown.bind(this)}
                                           value={this.state.price1}/>
                {this.state.isMiddle ? (<span>
                    <span>Cena za druhý úsek</span>
                    <input type="text" name="price2" onChange={this.handleKeydown.bind(this)}
                           value={this.state.price2}/>
                    </span>) : ""}
                <br/>
                Pravidelná cesta: <input type="checkbox" name="regularity" onChange={this.handleKeydown.bind(this)}
                                         value={this.state.regularity}/><br/>
                Nastavit zpáteční jízdu: <input type="checkbox" name="isRideBack"
                                                onChange={this.handleKeydown.bind(this)}
                                                value={this.state.isRideBack}/><br/>
                {this.state.isRideBack ? (
                    <span>
                        Časy pro zpáteční jízdu: <br/>
                        Start: <input name="originStopTime" onChange={this.handleKeydown.bind(this)}
                                      value={this.state.originStopTime}/>
                        {this.state.isMiddle ? (<span>
                            Mezizastavka: <input name="middleStopTime" onChange={this.handleKeydown.bind(this)}
                                                 value={this.state.middleStopTime}/>
                        </span>) : ""}
                        Konec: <input name="destinationTime" onChange={this.handleKeydown.bind(this)}
                                      value={this.state.destinationTime}/>
                    </span>
                ) : ""}
                <br/>
                Typ Cesty: <input type="text"  name="rideType" onChange={this.handleKeydown.bind(this)} value={this.state.rideType}/><br/><br/>
                <button type="button" onClick={this.submit.bind(this)}>Vytvořit jízdu</button>
            </div>
                    </div></div></div>)
    }
}

export default connect(function (store) {
    return {
        profile: store.userReducer.profile,
        userId: store.sessionReducer.userId,
        loading: store.userReducer.loading_profile,
    }
})(CreateRide)
