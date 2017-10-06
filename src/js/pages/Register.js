import React from "react";
import {connect} from "react-redux"
import {register} from "../redux/UserAction";
import Constants from "../utils/Constants";
import {NavLink, withRouter} from 'react-router-dom'
import axios from 'axios'
import ValidatedInput from "../components/ValidatedInput";
import {isValidationError, validate} from "../utils/RideUtil";

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            surName: "",
            email: "",
            password: "",
            phone: "",
            errors: {},
            show_validations: false,
        };
    }


    handleKeydown(event) {
        let newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
        console.log(this.state)
    }


    submit(event) {
        if (isValidationError(this.state.errors)) {
            this.setState({errors: {...this.state.errors}, show_validations: true});
            return;
        } else {
            this.setState({errors: {}, show_validations: false});
        }
        console.log("registruji")
        let user = {
            firstname: this.state.firstName,
            surname: this.state.surName,
            phone: this.state.phone,
            email: this.state.email,
            password: this.state.password,
        }
        this.props.dispatch(register(user))
    }

    goToLogin() {
        axios.get(Constants.baseURL + "/users/activate/" + this.props.activationToken);
        this.props.history.push("/login");
    }

    setValidationMessage(name, value) {
        if (value) {
            this.state.errors[name] = value;
        } else {
            this.state.errors[name] = null;
        }
    }


    render() {
        console.log("auth v reg je " + this.props.authenticated)
        var activationURL = Constants.baseURL + "/users/activate/" + this.props.activationToken;
        var html = <div>Registrováno. Klikni na tento odkaz pro aktivaci: <a onClick={this.goToLogin.bind(this)}>Odkaz</a></div>
        if (this.props.registered === false) {
            html = <div class="container">
                <div class="row margin100">
                    <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        <h3 style={{color: 'white'}}>Aplikace Spolujízda</h3>
                        <div class="redStripe">

                        </div>
                    </div>
                    <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        <div class="well">
                            <h1>Registrace</h1>
                            <br/>
                            <label for="firstName">Name:</label>
                            <ValidatedInput name="firstName" errors={this.state.errors} handleKeydown={this.handleKeydown.bind(this)}
                                            setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.firstName}
                                            showValidation={this.state.show_validations}
                                            conditions={{nonEmpty: true, minLength: 3}}/>
                            <label for="surName">Příjmení:</label>
                            <ValidatedInput name="surName" errors={this.state.errors} handleKeydown={this.handleKeydown.bind(this)}
                                            setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.surName}
                                            showValidation={this.state.show_validations}
                                            conditions={{nonEmpty: true, minLength: 3}}/>
                            <label for="phone">Telefon:</label>
                            <ValidatedInput name="phone" errors={this.state.errors} handleKeydown={this.handleKeydown.bind(this)} value={this.state.phone}
                                            showValidation={this.state.show_validations}
                                            setValidationMessage={this.setValidationMessage.bind(this)}
                                            conditions={{nonEmpty: true, minLength: 8, onlyNumbers : true}}/>
                            <label for="email">Email:</label>
                            <ValidatedInput name="email" errors={this.state.errors} handleKeydown={this.handleKeydown.bind(this)}
                                            showValidation={this.state.show_validations}
                                            setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.email}
                                            conditions={{nonEmpty: true, regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/}}/>
                            <label for="password">Heslo:</label>
                            <ValidatedInput name="password" errors={this.state.errors} handleKeydown={this.handleKeydown.bind(this)}
                                            showValidation={this.state.show_validations}
                                            setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.password}
                                            conditions={{nonEmpty: true, minLength: 3}}/>
                            <br/>
                            <button type="button" class="btn btn-default" onClick={this.submit.bind(this)}>Registrovat</button>
                            <NavLink class="floatRight" to="/login">Zpět na přihlášení</NavLink><br/>
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

export default withRouter(connect(function (store) {
    return {
        error: store.sessionReducer.error,
        registered: store.userReducer.registered,
        activationToken: store.userReducer.activationToken,
        authenticated: store.sessionReducer.authenticated

    }
})(Register))