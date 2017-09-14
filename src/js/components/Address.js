import React from "react";
import {connect} from "react-redux"
import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";

class Address extends React.Component {
    constructor() {
        super();
        this.state = {
            city: "",
            country: "",
            number: "",
            placeDescription: "",
            stopTime: "",
            street: ""
        }
    }

    componentWillMount() {
        if (this.props.data) {
            this.setState(this.props.data);
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


    render() {

        let html = null;
        if (!this.props.data) {
            html =
                <div>

                    Stát: <input type="text" name="country" value={this.state.country}
                                 onChange={this.handleKeydown.bind(this)}/><br/>
                    Město: <input type="text" name="city" value={this.state.city}
                                  onChange={this.handleKeydown.bind(this)}/><br/>
                    Ulice: <input type="text" name="street" value={this.state.street}
                                  onChange={this.handleKeydown.bind(this)}/><br/>
                    Číslo popisné: <input type="text" name="number" value={this.state.number}
                                          onChange={this.handleKeydown.bind(this)}/><br/>
                    Popis místa: <input type="text" name="placeDescription" value={this.state.placeDescription}
                                        onChange={this.handleKeydown.bind(this)}/><br/>
                    Čas: <input type="text" name="stopTime" value={this.state.stopTime}
                                onChange={this.handleKeydown.bind(this)}/><br/>
                </div>;
        } else {
            html =
                <div>
                    <b>Stát:</b> {this.props.data.country}<br/>
                    <b>Město:</b> {this.props.data.city}<br/>
                    <b>Ulice:</b> {this.props.data.street}<br/>
                    <b>Číslo popisné:</b> {this.props.data.number}<br/>
                    <b>Popis místa:</b> {this.props.data.placeDescription}<br/>
                    <b>Čas: </b> {this.props.data.stopTime}<br/>
                </div>
        }

        return (
            <div>
                <h3>{this.props.name}</h3>
                {html}
            </div>
        )
    }
}

export default connect(function (store) {
    return {
        profile: store.userReducer.profile,
        userId: store.sessionReducer.userId,
        loading: store.userReducer.loading_profile,
    }
})(Address)
