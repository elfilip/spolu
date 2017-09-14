import React from "react";

import {logout, redirect} from "../redux/SessionAction";
import  {connect}  from "react-redux"
import {withRouter } from 'react-router-dom'


class Logout extends React.Component {
    constructor() {
        super();
        this.state = {
            redirect: null,
        };
    }

    handleLogout() {
        this.props.dispatch(logout());
        this.props.dispatch(redirect("login"))
    }

    render() {
        var output;
        if(this.props.username ===null){
            output = <div>Not logged</div>;
        }else{
            output=<div>
                Username: {this.props.username}<br/>
                <button onClick={this.handleLogout.bind(this)}>Logout</button>
            </div>
        }
        return (
            <div>
                {output}
            </div>
        );
    }
}

export default withRouter(connect(function (store) {
    return {
        username: store.sessionReducer.username
    }
})(Logout))
