import React from "react";
import {connect} from "react-redux"
import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import {loadUserRides} from "../redux/RideAction";
import Ride from "../components/Ride";
import RideType from "../utils/RideType";

class SearchRide extends React.Component {
    constructor() {
        super();
        this.state = {
            criteria: {
                fromCity: "",
                toCity: "",
                fromAfter: "",
                toAfter: "",
                fromBefore: "",
                toBefore: "",
                minFreeCapacity: "",
                minPrice: "",
                maxPrice: "",
                rideType: "NULL",
                detour: "",
                regularity: "",
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

    render() {
        let rides = null;
        if (this.state.rides) {
            rides = this.state.rides.map(function (ride) {
                return <Ride key={ride.id} ride={ride.ride} type={RideType.HOST}/>
            })
        }
        return (
            <div>
                <h1>Hledání Jízdy</h1>
                {this.state.error}<br/>
                Odkud: <input type="text" name="fromCity" value={this.state.criteria.fromCity}
                              onChange={this.handleKeydown.bind(this)}/>
                Kam: <input type="text" name="toCity" value={this.state.criteria.toCity}
                            onChange={this.handleKeydown.bind(this)}/><br/>
                Kdy chci jet nejdříve: <input type="text" name="fromAfter" value={this.state.criteria.fromAfter}
                                              onChange={this.handleKeydown.bind(this)}/><br/>
                Kdy chci jet nejpozději: <input type="text" name="fromBefore" value={this.state.criteria.fromBefore}
                                                onChange={this.handleKeydown.bind(this)}/><br/>
                {!this.state.show_extended_filter ?
                    <span><a onClick={this.showExtended.bind(this)}>Zobrazit rošířené vyhledávání</a><br/></span>
                    :
                    <div>
                        <a onClick={this.showExtended.bind(this)}>Skrýt rozšířené vyhledávání</a><br/>
                        Kdy chci dorazit nejdříve: <input type="text" name="toAfter" value={this.state.criteria.toAfter}
                                                          onChange={this.handleKeydown.bind(this)}/><br/>
                        Kdy chci dorazit nejpozději: <input type="text" name="toBefore"
                                                            value={this.state.criteria.toBefore}
                                                            onChange={this.handleKeydown.bind(this)}/><br/>
                        Minimální volná kapacita: <input type="text" name="minFreeCapacity"
                                                         value={this.state.criteria.minFreeCapacity}
                                                         onChange={this.handleKeydown.bind(this)}/><br/>
                        Cena Min: <input type="text" name="minPrice" value={this.state.criteria.minPrice}
                                         onChange={this.handleKeydown.bind(this)}/>
                        Cena Max: <input type="text" name="maxPrice" value={this.state.criteria.maxPrice}
                                         onChange={this.handleKeydown.bind(this)}/><br/>
                        Typ Jízdy:
                        <select name="rideType" value={this.state.criteria.rideType}
                                onChange={this.handleKeydown.bind(this)}>
                            <option value="PERSONAL">Osobní</option>
                            <option value="BUSSINESS">Pracovní</option>
                            <option value="NULL">Nezadáno</option>
                        </select><br/>
                        Zajížďka: <input type="checkbox" name="detour" value={this.state.criteria.detour}
                                         onChange={this.handleKeydown.bind(this)}/><br/>
                        Pravidelná jízda: <input type="checkbox" name="regularity"
                                                 value={this.state.criteria.regularity}
                                                 onChange={this.handleKeydown.bind(this)}/><br/>
                    </div>}
                <button onClick={this.submit.bind(this)}>Vyhledat</button>
                {this.state.loading}
                {rides}
            </div>)
    }
}

export default connect(function (store) {
    return {
        userId: store.sessionReducer.userId,

    }
})(SearchRide)
