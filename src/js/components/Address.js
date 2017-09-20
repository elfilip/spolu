import React from "react";
import {connect} from "react-redux"
import moment from "moment"
import DateTimePicker from "./DateTimePicker";

class Address extends React.Component {
    constructor() {
        super();
        this.state = {
            address: "",
            stopTime: "",
            moment: moment(),
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

    handleChange(aaa) {
        console.log(aaa)
    }

    handleSave(aaa) {
        console.log(aaa)
    }


    render() {
        var asterixColor = this.state.address ? {color: 'green'} : {color: 'red'}
        let html = null;
        if (!this.props.data) {
            html =
                <div>
                    <div class="divAddress">
                        <span class="iconMargin glyphicon glyphicon-asterisk" style={asterixColor}></span>
                        <input class="no-border inputAddress" type="text" placeholder={this.props.placeHolder} name="address" value={this.state.country} onChange={this.handleKeydown.bind(this)}/>
                    </div>
                </div>
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
