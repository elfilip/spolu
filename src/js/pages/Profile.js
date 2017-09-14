import React from "react";
import {connect} from "react-redux"
import {getProfile} from "../redux/UserAction";
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            profile: {
                carDescription: "",
                comment: "",
                department: "",
                firstname: "",
                phone: "",
                placeOfWork: "",
                position: "",
                surname: "",
                password: "",
                get_profile_status: 'Not Loaded'
            }
        }
    }

    componentWillMount() {
        console.log("profile will mount")
        this.loadProfile(this.props.userId)
    }

    loadProfile() {
        this.setState({get_profile_status: 'Loading...'})
        axios.get(Constants.baseURL + '/user/' + this.props.userId)
            .then(function (response) {
                this.setState({
                    profile: {
                        carDescription: response.data.carDescription,
                        comment: response.data.comment,
                        department: response.data.department,
                        firstname: response.data.firstname,
                        phone: response.data.phone,
                        placeOfWork: response.data.placeOfWork,
                        position: response.data.position,
                        surname: response.data.surname,
                    },
                    password: response.data.password,
                    get_profile_status: 'Loaded'
                })
            }.bind(this))
            .catch((error) => {
                this.props.dispatch({type: 'SET_ERROR', error: "Can't get user. " + error.status})
                console.log(error)
            })
    }

    setProfile() {
        axios.put(Constants.baseURL + '/user/' + this.props.userId, this.state.profile)
            .then(function (response) {
                this.setState({get_profile_status: 'Updated'});
                this.loadProfile();
                this.props.dispatch(setOKMessage("Profil změněn."))
            }.bind(this))
            .catch(function (error) {
                this.props.dispatch({type: 'SET_ERROR', error: "Can't update user. " + error.status})
                console.log(error)
            }.bind(this))
    }

    handleKeydown(event) {
        let newProfile = this.state.profile;
        newProfile[event.target.name] = event.target.value;
        this.setState({profile: newProfile});
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    submit(event) {
        this.setProfile();
    }

    changePassword() {
        const config = {headers: {'Content-Type': 'application/json'}};
        axios.put(Constants.baseURL + '/user/' + this.props.userId+'/password?newPassword='+ this.state.password,null, config)
            .then(function (response) {
                this.props.dispatch(setOKMessage("Heslo změněno."))
            }.bind(this))
            .catch(function (error) {
                this.props.dispatch({type: 'SET_ERROR', error: "Nelze změnit heslo. " + error.status})
                console.log(error)
            }.bind(this))
    }

    render() {
        return (
            <div>
                <h1>Váš Profil</h1>
                {this.state.get_profile_status}
                Jméno: <input type="text" name="firstName" value={this.state.profile.firstname}
                              onChange={this.handleKeydown.bind(this)}/><br/>
                Příjmení: <input type="text" name="surName" value={this.state.profile.surname}
                                 onChange={this.handleKeydown.bind(this)}/><br/>
                Telefon: <input type="text" name="phone" value={this.state.profile.phone}
                                onChange={this.handleKeydown.bind(this)}/><br/>
                Oddělní: <input type="text" name="department" value={this.state.profile.department}
                                onChange={this.handleKeydown.bind(this)}/><br/>
                Pracovní Místo: <input type="text" name="placeOfWork" value={this.state.profile.placeOfWork}
                                       onChange={this.handleKeydown.bind(this)}/><br/>
                Pozice: <input type="text" name="position" value={this.state.profile.position}
                               onChange={this.handleKeydown.bind(this)}/><br/>
                Poznámka: <input type="text" name="comment" value={this.state.profile.comment}
                                 onChange={this.handleKeydown.bind(this)}/><br/>
                Popis auta: <input type="text" name="carDescription" value={this.state.profile.carDescription}
                                   onChange={this.handleKeydown.bind(this)}/><br/>
                <input type="button" value="Změnit" onClick={this.submit.bind(this)}/><br/>
                <br/>
                <br/>
                Změna Hesla:<br/>
                Nové Heslo: <input type="password" name="password" value={this.state.password}
                                   onChange={this.handlePassword.bind(this)}/><br/>
                <input type="button" value="Změnit Heslo" onClick={this.changePassword.bind(this)}/><br/>
            </div>)
    }
}

export default connect(function (store) {
    return {
        profile: store.userReducer.profile,
        userId: store.sessionReducer.userId,
        loading: store.userReducer.loading_profile,
    }
})(Profile)
