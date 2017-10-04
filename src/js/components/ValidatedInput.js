import React from "react";
import {connect} from "react-redux"
import {withRouter} from 'react-router-dom'
import RideType from "../utils/RideType";
import RideProfileImage from "./RideProfileImage";

class ValidatedInput extends React.Component {
    constructor() {
        super();
        this.state = {
            error: null,
        }
    }

    componentDidMount(){
        this.props.setValidationMessage(this.props.name,this.validate(this.props.value));
    }

    handleKeydown(event) {
        this.props.handleKeydown(event);
        this.props.setValidationMessage(event.target.name, this.validate(event.target.value));
    }

    validate(value){
        if(this.props.nonEmpty && !value){
            return "Toto pole je povinné"
        }
        if(this.props.onlyNumbers && value.isNaN()){
            return "Musí být zadáno číslo"
        }
        if(this.props.minLength > value.length){
            return "Minimální počet znaků je "+this.props.minLength;
        }
        if(this.props.maxLength < value.length){
            return "Maximální počet znaků je "+this.props.maxLength;
        }
        if(this.props.minValue > value){
            return "Minimální hodnota je "+this.props.minValue;
        }
        if(this.props.maxValue < value){
            return "Maximální hodnota je "+this.props.maxValue;
        }
        if(this.props.regex && !this.props.regex.test(value)){
            return "Špatný formát"
        }
        return null;
    }

    render() {


        return (
            <div>
                {this.props.errors && this.props.errors[this.props.name] ?
                <div style={{color: "red"}}>
                    {this.props.errors[this.props.name]}
                </div> : ""}
                <input type="text" class="form-control" name={this.props.name} value={this.props.value} onChange={this.handleKeydown.bind(this)}/>
            </div>
        )
    }
}

export default withRouter(connect(function (store) {
    return {}
})(ValidatedInput))
