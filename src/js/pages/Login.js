import React from "react";
import {NavLink,} from "react-router-dom";

import {clearLoginMessage, loginRequest} from "../redux/SessionAction";
import {connect} from "react-redux"
import { createHashHistory } from 'history';
import {validateEmail} from "../utils/RideUtil";
const history = createHashHistory()

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            username: null,
            password: null,
            validation_message: null,
        };
    }

    handleUserName(event) {
        this.setState({username: event.target.value});
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    handleLogin() {
        this.props.dispatch(clearLoginMessage());
        if(this.validateInputs()) {
            this.setState({validation_message: null})
            this.props.dispatch(loginRequest(this.state.username, this.state.password));
        }
    }

    validateInputs(){
        var message = "";
        if(!this.state.username || !this.state.password){
            message = "Musíte zadat email a heslo."
        }else {
            if(!validateEmail(this.state.username)){
                message=message + "Email má špatný formát."
            }
        }
        if(message) {
            this.setState({validation_message : message})
            return false;
        }
        return true;

    }

    redirect() {
        if (this.props.authenticated === true) {
            this.props.dispatch(this.redirect("/main"))
        }
    }

    render() {
        if(this.props.authenticated == true){
            history.push('/main');

        }
        var html = null;
        var loginStyle = {textAlign: 'center', margin: '0px auto', paddingBottom: '25px'};
        var registerStyle={float: 'right', marginBottom: '15px'};
        var submitStyle={width: '50%'};
        var rowStyle={	margin: '100px auto'}

        if (this.props.authenticated === false || !this.props.username || !this.props.userId) {
            html =
                <div class="container">
                    <div class="row margin100">

                        <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                            <h3 style={{color: 'white'}} >Aplikace Spolujízda</h3>
                            <div class="redStripe">

                            </div>
                        </div>
                        <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                            <div class="well" style={loginStyle}>
                                <h1>Přihlášení</h1>
                                {this.props.error ?
                                    <div class="alert alert-danger">
                                        {this.props.error}
                                    </div>
                                    : ""
                                }
                                {this.state.validation_message ?
                                    <div class="alert alert-danger">
                                        {this.state.validation_message}
                                    </div>
                                    : ""
                                }
                                <div class="input-group" style={{textAlign: 'center'}}>
                                    <span class="input-group-addon">Email</span>
                                    <input type="text" class="form-control" placeholder="uzivatel@kb.cz" onChange={this.handleUserName.bind(this)}/><br/>
                                    <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                </div>
                                <div class="input-group">
                                    <span class="input-group-addon">Heslo</span>
                                    <input type="password" class="form-control" placeholder="Heslo" onChange={this.handlePassword.bind(this)}/><br/>
                                    <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                                </div>
                                <br/>
                                <button type="button"  class="btn btn-default" style={submitStyle} onClick={this.handleLogin.bind(this)}>Přihlásit</button>
                                <br/>
                                <NavLink style={registerStyle} to="/register">Registrovat</NavLink>
                            </div>
                        </div>
                    </div>
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
