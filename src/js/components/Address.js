import React from "react";
import {connect} from "react-redux"

class Address extends React.Component {
    constructor() {
        super();
        this.state = {
            address: "",
            stopTime: "",
            autocomplete: null,
        }
    }

    componentDidMount() {
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(48.628940, 11.592913),
            new google.maps.LatLng(51.052934, 18.923703));
        var options = {bounds: defaultBounds, strictBounds : true};
        var map = new google.maps.Map(this.refs.addInput);
        var input = this.refs.addInput;
        var autocomplete = new google.maps.places.Autocomplete(input,options);
        this.setState({autocomplete: autocomplete})
    }

    handleKeydown(event) {
        let newState = {}
        newState[event.target.name] = event.target.value;
        this.setState(newState);
        let output = {...this.state};
        output[event.target.name] = event.target.value;
        this.props.update(event.target.value);
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
                    <h4>{this.props.name}</h4>
                    <div class="divAddress">
                        <span class="iconMargin glyphicon glyphicon-asterisk" style={asterixColor}></span>
                        <input ref="addInput" class="no-border inputAddress" type="text" placeholder={this.props.placeHolder} name="address" value={this.state.country} onChange={this.handleKeydown.bind(this)}/>
                    </div>
                </div>
        } else {
            html =
                <div>
                    <span style={{fontSize: '15px'}}>{this.props.data}</span>
                </div>

        }

        return (
            <div>
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
