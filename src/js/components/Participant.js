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
        var img= <span style={{backgroundColor: 'gray'}} class="glyphicon glyphicon-user profileDefault"></span>

        return (
            <div style={{textAlign: 'center',display: 'inline-block', padding: '5px'}}>{img}<br/> {participant.firstname}, {participant.surname}<br/></div>
        )
    }
}

export default withRouter(connect(function (store) {
    return {
    }
})(Participant))
