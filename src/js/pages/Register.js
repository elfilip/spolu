import React from "react";
import  {connect}  from "react-redux"
import {register} from "../redux/UserAction";
import Constants from "../utils/Constants";
import {withRouter } from 'react-router-dom'
import axios from 'axios'
class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            firstName:"",
            surName: "",
            email:"",
            password: "",
            phone:""
        };
    }


    handleKeydown(event) {
        let newState={};
        newState[event.target.name]=event.target.value;
        this.setState(newState);
        console.log(this.state)
    }

    submit(event){
        console.log("registruji")
        let user={
            firstname: this.state.firstName,
            surname: this.state.surName,
            phone: this.state.phone,
            email:this.state.email,
            password: this.state.password,
        }
       this.props.dispatch(register(user))
    }
    goToLogin(){
        axios.get(Constants.baseURL + "/users/activate/"+this.props.activationToken);
        this.props.history.push("/login");
    }

    render() {
        console.log("auth v reg je "+this.props.authenticated)
        var activationURL = Constants.baseURL + "/users/activate/"+this.props.activationToken;
        var html=<div>Registrováno. Klikni na tento odkaz pro aktivaci: <a onClick={this.goToLogin.bind(this)}>Odkaz</a></div>
        if(this.props.registered === false){
            html= <div>
                <h1>Register Page</h1>
                First name: <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleKeydown.bind(this)}/><br/>
                Surname: <input type="text" name="surName" value={this.state.surName} onChange={this.handleKeydown.bind(this)}/><br/>
                Phone: <input type="text" name="phone" value={this.state.phone} onChange={this.handleKeydown.bind(this)}/><br/>
                Email: <input type="text" name="email" value={this.state.email} onChange={this.handleKeydown.bind(this)}/><br/>
                Password: <input type="password" name="password" value={this.state.password} onChange={this.handleKeydown.bind(this)}/><br/>
                <input type="button" value="Registrovat" onClick={this.submit.bind(this)}/><br/>
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