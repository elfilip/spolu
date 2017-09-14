import React from "react";
import { NavLink, } from "react-router-dom";

import {loginRequest} from "../redux/SessionAction";
import {connect} from "react-redux"

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            username: null,
            password: null,
        };
    }

    handleUserName(event) {
        this.setState({username: event.target.value});
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    handleLogin() {
        this.props.dispatch(loginRequest(this.state.username, this.state.password));
    }

    redirect(){
        if(this.props.authenticated === true){
            this.props.dispatch(this.redirect("/main"))
        }
    }

    render() {
        var html = null;
        if (this.props.authenticated === false || !this.props.username || !this.props.userId) {
            html =
                <div>
                    <h1>Login</h1>
                    {this.props.error}<br/>
                    Username: <input onChange={this.handleUserName.bind(this)}/><br/>
                    Password: <input type="password" onChange={this.handlePassword.bind(this)}/><br/>
                    <button onClick={this.handleLogin.bind(this)}>Login</button><br/>
                    <NavLink to="/register">Registrovat</NavLink>
                </div>
        }
        return (
            <div>
                {html}
            </div>
        );
    }
}

export default connect(function (store) {
    return {
        error: store.sessionReducer.login_error,
        authenticated: store.sessionReducer.authenticated,
        username: store.sessionReducer.username,
        userId: store.sessionReducer.userId,
    }
})(Login)
