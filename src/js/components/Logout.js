import React from "react";

import {logout, redirect} from "../redux/SessionAction";
import {connect} from "react-redux"
import {withRouter} from 'react-router-dom'


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

    handleProfile() {
        this.props.dispatch(redirect("profile"))
    }

    render() {
        var output;
        if (this.props.username == null) {
            output = <div>Not logged</div>;
        }
        return (
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#/profile"> <span class="glyphicon glyphicon-user"/> {this.props.username}</a></li>
                    <li><a href="#" onClick={this.handleLogout.bind(this)}> <span class="glyphicon glyphicon-log-in"></span> Odhlásit</a></li>
                </ul>
        );
    }
}

export default withRouter(connect(function (store) {
    return {
        username: store.sessionReducer.username
    }
})(Logout))
