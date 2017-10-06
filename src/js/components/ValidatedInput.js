import React from "react";
import {connect} from "react-redux"
import {withRouter} from 'react-router-dom'
import {validate} from "../utils/RideUtil";

class ValidatedInput extends React.Component {
    constructor() {
        super();
        this.state = {
            error: null,
        }
    }

    componentDidMount() {
        this.props.setValidationMessage(this.props.name, validate(this.props.conditions, this.props.value));
    }

    componentDidUpdate() {
        this.props.setValidationMessage(this.props.name, validate(this.props.conditions, this.props.value));
    }

    handleKeydown(event) {
        this.props.handleKeydown(event);
        this.props.setValidationMessage(event.target.name, validate(this.props.conditions, event.target.value));
    }

    render() {


        return (
            <div>
                {this.props.errors && this.props.errors[this.props.name] && this.props.showValidation ?
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
