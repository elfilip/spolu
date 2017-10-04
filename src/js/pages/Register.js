import React from "react";
import {connect} from "react-redux"
import {register} from "../redux/UserAction";
import Constants from "../utils/Constants";
import {NavLink, withRouter} from 'react-router-dom'
import axios from 'axios'
import ValidatedInput from "../components/ValidatedInput";
import {isValidationError} from "../utils/RideUtil";

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            surName: "",
            email: "",
            password: "",
            phone: "",
            error_hidden: {},
            error: {}
        };
    }


    handleKeydown(event) {
        let newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
        console.log(this.state)
    }



    submit(event) {
        if(isValidationError(this.state.error_hidden)){
            this.setState({error: {...this.state.error_hidden}})
            return;
        }else{
            this.setState({error: {}})
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

    setValidationMessage(name, value){
        var errors={...this.state.error_hidden}
        if(value){
            errors[name]=value;
        }else{
            errors[name]=null;
        }
        this.setState({error_hidden: errors})
    }

    render() {
        console.log("auth v reg je " + this.props.authenticated)
        var activationURL = Constants.baseURL + "/users/activate/" + this.props.activationToken;
        var html = <div>Registrováno. Klikni na tento odkaz pro aktivaci: <a onClick={this.goToLogin.bind(this)}>Odkaz</a></div>
        if (this.props.registered === false) {
            html = <div class="container">
                <div class="row margin100">
                    <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        <h3 style={{color: 'white'}} >Aplikace Spolujízda</h3>
                        <div class="redStripe">

                        </div>
                    </div>
                    <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        <div class="well">
                            <h1>Registrace</h1>
                            <br/>
                            <label for="firstName">Name:</label>
                            <ValidatedInput name="firstName" errors={this.state.error} handleKeydown={this.handleKeydown.bind(this)}
                                            setValidationMessage={this.setValidationMessage.bind(this)}  value={this.state.firstName} nonEmpty={true} minLength={3}/>
                            <label for="surName">Příjmení:</label>
                            <input type="text" id="surName" class="form-control" name="surName" value={this.state.surName} onChange={this.handleKeydown.bind(this)}/>
                            <label for="phone">Telefon:</label>
                            <input type="text" class="form-control" id="phone" name="phone" value={this.state.phone} onChange={this.handleKeydown.bind(this)}/>
                            <label for="email">Email:</label>
                            <input type="text" class="form-control" id="email" name="email" value={this.state.email} onChange={this.handleKeydown.bind(this)}/>
                            <label for="password">Heslo:</label>
                            <input type="password" class="form-control" id="password" name="password" value={this.state.password} onChange={this.handleKeydown.bind(this)}/>
                            <br/>
                            <button type="button"  class="btn btn-default" onClick={this.submit.bind(this)}>Registrovat</button>
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