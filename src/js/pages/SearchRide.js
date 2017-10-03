import React from "react";
import {connect} from "react-redux"
import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import {loadUserRides} from "../redux/RideAction";
import Ride from "../components/Ride";
import RideType from "../utils/RideType";
import DateTimePicker from "../components/DateTimePicker";

class SearchRide extends React.Component {
    constructor() {
        super();
        this.state = {
            criteria: {
                fromAddress: "",
                toAddress: "",
                fromAfter: "",
                toAfter: "",
                fromBefore: "",
                toBefore: "",
                minFreeCapacity: "",
                minPrice: "",
                maxPrice: "",
                rideType: "NULL",
                detour: "NULL",
                regularity: "NULL",
            },
            error: null,
            loading: null,
            rides: null,
            show_extended_filter: false,
        }
    }

    componentWillMount() {

    }

    handleKeydown(event) {
        let newState = this.state.criteria;
        if (event.target.type == 'checkbox') {
            newState[event.target.name] = event.target.checked;
        } else {
            newState[event.target.name] = event.target.value;
        }
        this.setState({criteria: newState});
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
        this.setState({error: null});
        var queryString = "";
        for (var property in this.state.criteria) {
            if (this.state.criteria[property] && this.state.criteria[property] != "NULL") {
                queryString = queryString + property + '=' + this.state.criteria[property] + "&";
            }
        }
        if (queryString.length == 0) {
            this.setState({error: "Musíte zadat aspoň jeden parameter !"});
            return;
        }
        queryString = "?" + queryString.substring(0, queryString.length - 1);
        this.getSearchedRides(queryString);
    }

    getSearchedRides(queryString) {
        this.setState({loading: 'Loading...'})
        axios.get(Constants.baseURL + '/rides' + queryString)
            .then(function (response) {
                this.setState({loading: null, rides: response.data});
            }.bind(this))
            .catch(function (error) {
                this.props.dispatch({type: 'SET_ERROR', error: "Can't return results. " + error.status})
                console.log(error)
                this.setState({loading: null});
            }.bind(this));
    }

    showExtended() {
        this.setState({show_extended_filter: !this.state.show_extended_filter});
    }

    updateTime(name, value) {
        var newState = {...this.state.criteria};
        newState[name] = value;
        this.setState({criteria: newState});
    }


    render() {
        let rides = null;
        if (this.state.rides) {
            rides = this.state.rides.map(function (ride) {
                return <Ride key={ride.id} ride={ride.ride} type={RideType.HOST}/>
            })
        }
        return (
            <div>

                <div class="col-sm-12 col-sm-offset-0 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">

                    <div class="panel-default">
                        <div class="panel-heading"><h4>Vyhledat jízdu</h4></div>
                        <div class="panel-body">
                            <div class="col-sm-6 col-sm-offset-0 col-md-6 col-md-offset-0 col-lg-6 col-lg-offset-0">
                                <label for="fromAddress">Odkud:</label>
                                <input type="text" id="fromAddress" class="form-control" name="fromAddress" value={this.state.criteria.fromAddress} onChange={this.handleKeydown.bind(this)}/>
                            </div>
                            <div class="col-sm-6 col-md-6 col-lg-6">
                                <label for="toAddress">Kam:</label>
                                <input type="text" name="toAddress" class="form-control" value={this.state.criteria.toAddress} onChange={this.handleKeydown.bind(this)}/>
                            </div>
                            <br/>
                            <div class="col-sm-6 col-md-6 col-lg-6">
                                <label for="toAddress">Kdy chci vyrazit nejdříve:</label>
                                <DateTimePicker id="fromAfter" iconRight="true" update={this.updateTime.bind(this)}/>
                            </div>
                            <div class="col-sm-6 col-md-6 col-lg-6">
                                <label for="toAddress">Kdy chci vyrazit nejpozději:</label>
                                <DateTimePicker id="fromAfter" iconRight="true" update={this.updateTime.bind(this)}/>
                            </div>

                            {!this.state.show_extended_filter ?
                                <div class="col-sm-12 col-md-12 col-lg-12">
                                    <br/>
                                    <a onClick={this.showExtended.bind(this)}>Zobrazit rošířené vyhledávání</a><br/>
                                </div>
                                :

                                <div>
                                    <div class="col-sm-12 col-md-12 col-lg-12">
                                        <br/>
                                        <a onClick={this.showExtended.bind(this)}>Skrýt rozšířené vyhledávání</a><br/>
                                        <br/>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6">
                                        <label for="toAfter">Kdy chci dorazit nejdříve:</label>
                                        <DateTimePicker id="toAfter" iconRight="true" update={this.updateTime.bind(this)}/>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6">
                                        <label for="toBefore">Kdy chci dorazit nejpozději:</label>
                                        <DateTimePicker id="toBefore" iconRight="true" update={this.updateTime.bind(this)}/>
                                    </div>
                                    <div>
                                        <div class="col-sm-6 col-md-6 col-lg-6">
                                            <label for="minFreeCapacity">Minimální volná kapacita:</label>
                                            <input type="text" class=" capacity form-control" name="minFreeCapacity" value={this.state.criteria.minFreeCapacity} onChange={this.handleKeydown.bind(this)}/>
                                        </div>
                                        <div class="col-sm-6 col-md-6 col-lg-6">
                                            <label for="toBefore">Typ Jízdy:</label>
                                            <select style={{width: "130px"}} class="form-control" name="rideType" value={this.state.criteria.rideType}
                                                    onChange={this.handleKeydown.bind(this)}>
                                                <option value="PERSONAL">Osobní</option>
                                                <option value="BUSSINESS">Pracovní</option>
                                                <option value="NULL">Nezadáno</option>
                                            </select>
                                        </div>
                                        <div class="col-sm-6 col-md-6 col-lg-6">
                                            <label for="minPrice">Minimální cena: </label>
                                            <input type="text" class="capacity form-control" name="minPrice" value={this.state.criteria.minPrice} onChange={this.handleKeydown.bind(this)}/>
                                        </div>
                                        <div class="col-sm-6 col-md-6 col-lg-6">
                                            <label for="maxPrice">Maximální cena: </label>
                                            <input type="text" class=" capacity form-control" name="maxPrice" value={this.state.criteria.maxPrice} onChange={this.handleKeydown.bind(this)}/><br/>
                                        </div>
                                        <div class="col-sm-6 col-md-6 col-lg-6">
                                            <label for="detour">Zajížďka:</label>
                                            <select style={{width: "130px"}} class="form-control" name="detour" value={this.state.criteria.detour} onChange={this.handleKeydown.bind(this)}>
                                                <option value="TRUE">Ano</option>
                                                <option value="FALSE">Ne</option>
                                                <option value="NULL">Nezadáno</option>
                                            </select>
                                        </div>
                                        <div class="col-sm-6 col-md-6 col-lg-6">
                                            <label for="regularity">Pravidelná jízda: </label>
                                            <select style={{width: "130px"}} class="form-control" name="regularity" value={this.state.criteria.regularity} onChange={this.handleKeydown.bind(this)}>
                                                <option value="TRUE">Ano</option>
                                                <option value="FALSE">Ne</option>
                                                <option value="NULL">Nezadáno</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div class="col-sm-12 col-md-12 col-lg-12">
                                <br/>
                                <button type="button" class="btn btn-default" onClick={this.submit.bind(this)}>Vyhledat</button>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
                {rides ?
                    <div class="col-sm-12 col-sm-offset-0 col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">
                        <div class="panel-default">
                            <div class="panel-heading"><h4>Nalezené jízdy</h4></div>
                            <div class="panel-body">
                                {rides.length != 0 ? rides : <h4>Žádné jízdy k zobrazení</h4> }
                                {rides}
                            </div>
                        </div>
                    </div> : ""
                }
                {this.state.loading}

            </div>)
    }
}

export default connect(function (store) {
    return {
        userId: store.sessionReducer.userId,

    }
})(SearchRide)
