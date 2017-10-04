import React from "react";
import {connect} from "react-redux"
import {withRouter} from 'react-router-dom'
import RideType from "../utils/RideType";
import RideProfileImage from "./RideProfileImage";

class Participant extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    componentWillMount() {

    }

    render() {
        let participant = this.props.participant;
        var img2 = <span style={{backgroundColor: 'gray'}} class="glyphicon glyphicon-user profileDefault"></span>
        var img = <RideProfileImage profile={this.props.participant}/>

        return (
            <div style={{textAlign: 'center', display: 'inline-block', padding: '5px', verticalAlign: 'top'}}>
                {img}
                <br/>
                <div>
                {this.props.driver ? "ŘIDIČ" : ""}
                </div>
            </div>
        )
    }
}

export default withRouter(connect(function (store) {
    return {}
})(Participant))
