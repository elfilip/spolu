import React from "react";
import {connect} from "react-redux"
import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import Address from '../components/Address'
import {loadUserRides} from "../redux/RideAction";
import DateTimePicker from "../components/DateTimePicker";
import moment from "moment"
import cs from "moment/locale/cs"
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
            originStopTimeBack: "",
            middleStopTimeBack: "",
            destinationStopTimeBack: "",
            originStopTime: "",
            middleStopTime: "",
            destinationStopTime: "",
            rideType: "PERSONAL",
            detour: "",

        }
    }

    componentWillMount() {
        this.setState({
            originStopTimeBack: this.createMoment(),
            middleStopTimeBack: this.createMoment(),
            destinationStopTimeBack: this.createMoment(),
            originStopTime: this.createMoment(),
            middleStopTime: this.createMoment(),
            destinationStopTime: this.createMoment()
        })
    }

    createMoment(){
        var time=moment();
        time.locale('cs');
        return time.utc().format();
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

    toggleIsMiddle() {
        this.setState({isMiddle: !this.state.isMiddle})
    }

    updateTime(name, value) {
        var newState = {...this.state};
        newState[name] = value;
        this.setState(newState);
    }


    submit() {
        let ride = {};
        ride['capacity'] = this.state.capacity;
        ride['origin'] = {address: this.state.origin, stopTime: this.state.originStopTime};
        if (this.state.isMiddle)
            ride['middleStop'] = {address: this.state.middleStop, stopTime: this.state.middleStopTime};
        ride['destination'] = {address: this.state.destination, stopTime: this.state.destinationStopTime};
        ride['price1'] = this.state.price1;
        if (this.state.isMiddle)
            ride['price2'] = this.state.price2;
        ride['regularity'] = this.state.regularity;
        ride['rideType'] = this.state.rideType;
        ride['detour'] = false;
        if (this.state.isRideBack) {
            let rideBack = {
                destinationTime: this.state.destinationStopTimeBack,
                middleStopTime: this.state.middleStopTimeBack,
                originStopTime: this.state.originStopTimeBack
            }
            ride['rideBack'] = rideBack;
        }
        const config = {headers: {'Content-Type': 'application/json'}};
        axios.post(Constants.baseURL + '/rides', ride, config)
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
                        <div class="col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">

                            <div class="panel-default">
                                <div class="panel-heading"><h4>Nástup a výstup</h4></div>
                                <div class="panel-body">
                                    <Address name="Začátek trasy" placeHolder="Odkud..." update={this.updateOrigin.bind(this)}/>
                                    <Address name="Konec trasy" placeHolder="kam..." update={this.updateDest.bind(this)}/>
                                    <br/>
                                    <button type="button" data-toggle="collapse" data-target="#sideStop" class="btn btn-default" onClick={this.toggleIsMiddle.bind(this)}>
                                        {!this.state.isMiddle ? "Vložit mezizastávku" : "Zrušit mezizastávku"}</button>
                                    <div id="sideStop" class="collapse">
                                        <Address name="Mezizastávka trasy" placeHolder="Mezizastávka..." update={this.updateMiddle.bind(this)}/>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-default">
                                <div class="panel-heading"><h4>Čas výstup a nástupu</h4></div>
                                <div class="panel-body">
                                    <div>
                                        <h4 class="inline">Čas příjezdu</h4>
                                        <DateTimePicker name="originStopTime" update={this.updateTime.bind(this)} classCss="floatRightCreateRide"/>
                                    </div>
                                    {this.state.isMiddle ?
                                        <div>
                                            <h4 class="inline">Čas příjezdu do mezizastávky</h4>
                                            <DateTimePicker name="middleStopTime" update={this.updateTime.bind(this)} classCss="floatRightCreateRide"/>
                                        </div>
                                        : ""}
                                    <div>
                                        <h4 class="inline">Čas odjezdu</h4>
                                        <DateTimePicker name="destinationStopTime" update={this.updateTime.bind(this)} classCss="floatRightCreateRide"/>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-default">
                                <div class="panel-heading"><h4>Cena a počet míst ve vozidle</h4></div>
                                <div class="panel-body">
                                    <div>
                                        <h4 class="inline">Počet volných míst</h4>
                                        <input style={{float: "right"}} type="text" class="capacity form-control" value={this.state.capacity} onChange={this.handleKeydown.bind(this)} name="capacity"/>
                                    </div>
                                    {!this.state.isMiddle ?
                                        <div>
                                            <h4 class="inline">Cena za celou cestu</h4>
                                            <input style={{float: "right"}} type="text" class="capacity form-control" name="price1" onChange={this.handleKeydown.bind(this)} value={this.state.price1}/>
                                        </div> :
                                        <div>
                                            <div>
                                                <h4 class="inline">Cena do mezizastávky</h4>
                                                <input style={{float: "right"}} type="text" class="capacity form-control" name="price1" onChange={this.handleKeydown.bind(this)} value={this.state.price1}/>

                                            </div>
                                            <div>
                                                <h4 class="inline">Cena z mezizastávky do cíle</h4>
                                                <input style={{float: "right"}} type="text" class="capacity form-control" name="price2" onChange={this.handleKeydown.bind(this)} value={this.state.price2}/>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>


                            <div class="panel-default">
                                <div class="panel-heading"><h4>Detaily jízdy</h4></div>
                                <div class="panel-body">
                                    <div>
                                        <h4 class="inline">Pravidelná cesta</h4>
                                        <input style={{float: "right"}} type="checkbox" name="regularity" onChange={this.handleKeydown.bind(this)} value={this.state.regularity}/>
                                    </div>
                                    <div>
                                        <h4 class="inline">Typ cesty</h4>
                                        <select style={{float: "right", width: "130px"}} class="form-control" name="rideType" onChange={this.handleKeydown.bind(this)} value={this.state.rideType}>
                                            <option value="PERSONAL">Osobní</option>
                                            <option value="BUSSINESS">Pracovní</option>
                                        </select>
                                    </div>
                                    <div>
                                        <h4 class="inline">Jsem ochoten zajet pro pasažéra dále od trasy</h4>
                                        <input style={{float: "right"}} type="checkbox" name="detour" onChange={this.handleKeydown.bind(this)} value={this.state.detour}/>
                                    </div>
                                    <div>
                                        <h4 class="inline">Zadat zpáteční cestu</h4>
                                        <input style={{float: "right"}} type="checkbox" name="isRideBack" onChange={this.handleKeydown.bind(this)} value={this.state.isRideBack}/>
                                    </div>
                                </div>
                            </div>


                            {this.state.isRideBack ?
                                <div class="panel-default">
                                    <div class="panel-heading"><h4>Zpáteční cesta</h4></div>
                                    <div class="panel-body">
                                        <div>
                                            <h4 class="inline">Čas příjezdu</h4>
                                            <DateTimePicker name="originStopTimeBack" update={this.updateTime.bind(this)}/>
                                        </div>
                                        {this.state.isMiddle ?
                                            <div>
                                                <h4 class="inline">Čas příjezdu do mezizastávky</h4>
                                                <DateTimePicker name="middleStopTimeBack" update={this.updateTime.bind(this)}/>
                                            </div>
                                            : ""}
                                        <div>
                                            <h4 class="inline">Čas odjezdu</h4>
                                            <DateTimePicker name="destinationStopTimeBack" update={this.updateTime.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                                :
                                ""}

                            <button style={{float: "right"}} type="button" data-target="#sideStop" class="btn btn-primary btn-lg" onClick={this.submit.bind(this)}>Vytvořit jízdu</button>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default connect(function (store) {
    return {
        profile: store.userReducer.profile,
        userId: store.sessionReducer.userId,
        loading: store.userReducer.loading_profile,
    }
})(CreateRide)
