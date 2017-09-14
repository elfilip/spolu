import React from "react";
import {connect} from "react-redux"
import {withRouter } from 'react-router-dom'
import RideType from "../utils/RideType";

class Participant extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    componentWillMount() {

    }

    render() {
        let participant=this.props.participant;
        return (
            <span>{participant.firstname}, {participant.surname}, {participant.email} {participant.role == RideType.DRIVER ? '- RIDIČ' : ''}<br/></span>
        )
    }
}

export default withRouter(connect(function (store) {
    return {
    }
})(Participant))
