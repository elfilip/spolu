import React from "react";
import {connect} from "react-redux"
import axios from 'axios'
import Constants from '../utils/Constants'
import queryString from "query-string";
import Participant from "../components/Participant";
import RideType from "../utils/RideType";
import {deleteRide, addUserToRide, deleteUserFromRide, loadRide, clearRide} from "../redux/RideAction";
import RideDetailPair from "../components/RideDetailPair";
import * as RideUtil from "../utils/RideUtil";
import {Link} from "react-router-dom";
import {handleError} from "../utils/RideUtil";

class RideDetail extends React.Component {
    constructor() {
        super();
        this.state = {
            id: null,
        }
    }

    componentDidUpdate() {
        let queryParams = queryString.parse(this.props.location.search);
        if (queryParams.id != this.state.id) {
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
                handleError(this.props.dispatch, "Nelze načíst jízdu", error);
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
        if (section != -1)
            this.props.dispatch(addUserToRide(this.props.ride.id, this.props.userId, section, RideType.SIT));
        else {
            this.props.dispatch(addUserToRide(this.props.ride.id, this.props.userId, null, RideType.SIT));
        }
        this.setState({})
    }

    signoffRide() {
        this.props.dispatch(deleteUserFromRide(this.props.ride.id, this.props.userId));
    }


    render() {
        const buttonChars=30;
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
            applyButton1 = <button type="button" class="btn btn-default" onClick={this.applyRide.bind(this, 0)}>Přihlásit se k jízdě</button>

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
            applyButton1 = <button type="button" class="btn btn-default" onClick={this.applyRide.bind(this, 0)}>Přihlásit se trase &nbsp;
                <b>{RideUtil.trimName(origin.address,buttonChars)} -> {RideUtil.trimName(middle.address,buttonChars)}</b></button>
            applyButton2 = <button type="button" class="btn btn-default" onClick={this.applyRide.bind(this, 1)}>Přihlásit se k trase &nbsp;
                <b>{RideUtil.trimName(middle.address,buttonChars)} -> {RideUtil.trimName(destination.address,buttonChars)}</b></button>
            applyButton3 = <button type="button" class="btn btn-default" onClick={this.applyRide.bind(this, -1)}>Přihlásit se na celou trasu</button>

        }
        var button;
        if (this.props.type == RideType.DRIVER) {
            button = <button type="button" class="btn btn-default" onClick={this.removeRide.bind(this)}>Smazat</button>
        } else if (this.props.type == RideType.SIT) {
            button = <button type="button" class="btn btn-default" onClick={this.signoffRide.bind(this)}>Odhlásit</button>
        } else if (this.props.type == RideType.HOST) {

            button = <span>{applyButton1}<br/> {applyButton2} <br/>{applyButton3}</span>

        }
        return (
            <div>
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12  col-md-12  col-lg-12">

                            <div class="col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">

                                <div class="panel-default">
                                    <div class="panel-heading"><h4>Přihlášení</h4>
                                    </div>
                                    <div class="panel-body">
                                        {button}
                                    </div>
                                </div>
                                <div class="panel-default">
                                    <div class="panel-heading"><h4 style={{display: 'inline'}}>Nástup a výstup</h4>
                                    </div>
                                    <div class="panel-body">
                                        <RideDetailPair label="Z: " labelClass="detailAddressLabel" iconClass="glyphicon glyphicon-circle-arrow-right addressArrow greenColor"
                                                        valueClass="address" value={origin.address}/>
                                        {this.props.isMiddle ?
                                            <RideDetailPair label="Přes: " labelClass="detailAddressLabel" iconClass="glyphicon glyphicon-circle-arrow-right addressArrow blueColor"
                                                            valueClass="address" value={middle.address}/> : ""
                                        }
                                        <RideDetailPair label="Do: " labelClass="detailAddressLabel" iconClass="glyphicon glyphicon-circle-arrow-left addressArrow redColor"
                                                        valueClass="address" value={destination.address}/>
                                    </div>
                                </div>

                                <div class="panel-default">
                                    <div class="panel-heading"><h4>Čas výstup a nástupu</h4></div>
                                    <div class="panel-body">
                                        <RideDetailPair label="Odjezd: " labelClass="detailAddressLabel" iconClass="iconMargin glyphicon glyphicon-time"
                                                        valueClass="address" value={RideUtil.formatDate(origin.stopTime)}/>
                                        {this.props.isMiddle ?
                                            <RideDetailPair label="Mezzizastávka: " labelClass="detailAddressLabel" iconClass="iconMargin glyphicon glyphicon-time"
                                                            valueClass="address" value={RideUtil.formatDate(middle.stopTime)}/> : ""}
                                        <RideDetailPair label="Příjezd: " labelClass="detailAddressLabel" iconClass="iconMargin glyphicon glyphicon-time"
                                                        valueClass="address" value={RideUtil.formatDate(destination.stopTime)}/>
                                    </div>
                                </div>

                                <div class="panel-default">
                                    <div class="panel-heading"><h4>Cena a počet míst ve vozidle</h4></div>
                                    <div class="panel-body">
                                        <RideDetailPair label="Počet míst: " labelClass="detailAddressLabel" iconClass=""
                                                        valueClass="address" value={<span>{ride.freeCapacity} z {ride.capacity}</span>}/>
                                        {!this.props.isMiddle ?
                                            <RideDetailPair label="Cena: " labelClass="detailAddressLabel" iconClass=""
                                                            valueClass="address" value={<span>{this.getSection(ride, 0).price} Kč</span>}/>
                                            :
                                            <span>
                                        <RideDetailPair label="Cena do mezizastávky: " labelClass="detailAddressLabel" iconClass=""
                                                        valueClass="address" value={<span>{this.getSection(ride, 0).price} Kč</span>}/>
                                        <RideDetailPair label="Cena z mezizastávky: " labelClass="detailAddressLabel" iconClass=""
                                                        valueClass="address" value={<span>{this.getSection(ride, 1).price} Kč</span>}/>
                                        <RideDetailPair label="Cena za celou cestu: " labelClass="detailAddressLabel" iconClass=""
                                                        valueClass="address" value={<span>{RideUtil.computePrice(ride)} Kč</span>}/>
                                        </span>}
                                    </div>
                                </div>

                                <div class="panel-default">
                                    <div class="panel-heading"><h4>Detaily jízdy</h4></div>
                                    <div class="panel-body">
                                        <RideDetailPair label="Pravidelná cesta: " labelClass="detailAddressLabel" iconClass=""
                                                        valueClass="address" value={ride.regularity ? "Ano" : "Ne"}/>
                                        <RideDetailPair label="Typ cesty: " labelClass="detailAddressLabel" iconClass=""
                                                        valueClass="address" value={ride.rideType == "PERSONAL" ? "Soukromá cesta" : "Pracovní cesta"}/>
                                        <RideDetailPair label="Zajížďka: " labelClass="detailAddressLabel" iconClass=""
                                                        valueClass="address" value={ride.detour ? "Ano" : "Ne"}/>
                                        <RideDetailPair label="Cesta zpět: " labelClass="detailAddressLabel" iconClass=""
                                                        valueClass="address" value={ride.backRide && ride.backRide.id ? <Link to={"/rideDetail?id=" + ride.backRide.id}>Zpáteční jízda</Link> : "Není zadána."}/>
                                    </div>
                                </div>
                                <div class="panel-default">
                                    <div class="panel-heading"><h4>Spolucestující</h4></div>
                                    <div class="panel-body">
                                        {!this.props.isMiddle ?
                                            <div>
                                                <h4> Spolucestující </h4>
                                                <div>
                                                <Participant key={ride.driver.userId} participant={ride.driver} driver={true}/>
                                                {participants1}
                                                </div>
                                            </div> :
                                            <div>
                                                <h4> Spolucestující vyjíždějíci z {origin.address}</h4>
                                                <Participant participant={ride.driver} driver={true}/>
                                                {participants1}
                                                <h4> Spolucestující vyjíždějíci z {middle.address}</h4>
                                                <Participant participant={ride.driver} driver={true}/>
                                                {participants2}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
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
