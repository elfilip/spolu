import React from "react";
import {connect} from "react-redux"
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
        axios.put(Constants.baseURL + '/user/' + this.props.userId + '/password?newPassword=' + this.state.password, null, config)
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
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12 col-sm-offset-0 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">

                        <div class="panel-default">
                            <div class="panel-heading"><h4>Profil</h4></div>
                            <div class="panel-body">
                                <div class="col-sm-6 col-sm-offset-0 col-md-6 col-md-offset-0 col-lg-6 col-lg-offset-0">
                                    <label for="firstName">Jméno:</label>
                                    <input type="text" id="firstName" class="form-control" name="firstName" value={this.state.profile.firstname} onChange={this.handleKeydown.bind(this)}/>
                                </div>
                                <div class="col-sm-6 col-md-6 col-lg-6">
                                    <label for="surName">Příjmení:</label>
                                    <input type="text" id="surName" class="form-control" name="surName" value={this.state.profile.surname} onChange={this.handleKeydown.bind(this)}/>
                                </div>
                                <br/>
                                <div class="col-sm-12 col-sm-offset-0 col-md-12 col-md-offset-0 col-lg-12 col-lg-offset-0">
                                    <label for="phone">Telefon:</label>
                                    <input type="text" id="phone" class="form-control" name="phone" value={this.state.profile.phone} onChange={this.handleKeydown.bind(this)}/><br/>
                                    <label for="department">Oddělení:</label>
                                    <input type="text" id="department" class="form-control" name="department" value={this.state.profile.department} onChange={this.handleKeydown.bind(this)}/><br/>
                                    <label for="placeOfWork">Místo práce:</label>
                                    <input type="text" id="placeOfWork" class="form-control" name="placeOfWork" value={this.state.profile.placeOfWork} onChange={this.handleKeydown.bind(this)}/><br/>
                                    <label for="position">Pozice:</label>
                                    <input type="text" id="position" class="form-control" name="position" value={this.state.profile.position} onChange={this.handleKeydown.bind(this)}/><br/>
                                    <label for="comment">Poznámka:</label>
                                    <input type="text" id="comment" class="form-control" name="comment" value={this.state.profile.comment} onChange={this.handleKeydown.bind(this)}/><br/>
                                    <label for="carDescription">Popis auta:</label>
                                    <input type="text" id="carDescription" class="form-control" name="carDescription" value={this.state.profile.carDescription} onChange={this.handleKeydown.bind(this)}/><br/>
                                    <button type="button" class="btn btn-default" onClick={this.submit.bind(this)}>Změnit</button>
                                    <br/>
                                </div>
                            </div></div>
                            <br/>
                            <div class="panel-default">
                                <div class="panel-heading"><h4>Změna hesla</h4></div>
                                <div class="panel-body">
                                    <h4>Změna Hesla</h4>
                                    <label for="password">Nové Heslo:</label>
                                    <input type="password" id="password" class="form-control" name="password" value={this.state.password} onChange={this.handlePassword.bind(this)}/><br/>
                                    <button type="button" class="btn btn-default" onClick={this.changePassword.bind(this)}>Změnit Heslo</button>
                                    <br/>
                                </div>
                            </div>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(function (store) {
    return {
        profile: store.userReducer.profile,
        userId: store.sessionReducer.userId,
        loading: store.userReducer.loading_profile,
    }
})(Profile)
