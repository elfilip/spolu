import React from "react";
import {connect} from "react-redux"
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import ProfileImage from "../components/ProfileImage";
import {handleError, isValidationError, resizeBase64Img} from "../utils/RideUtil";
import ValidatedInput from "../components/ValidatedInput";

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
                get_profile_status: 'Not Loaded',
                avatar: null,
            },
            errorsProfile: {},
            errorsPassword: {},
            showValidationsProfile: false,
            showValidationsPassword: false,

        }
    }

    componentWillMount() {
        console.log("profile will mount")
        this.loadProfile(this.props.userId)
    }

    loadProfile() {
        this.setState({get_profile_status: 'Loading...'})
        axios.get(Constants.baseURL + '/user')
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
                        avatar: response.data.avatarBase64,
                    },
                    password: response.data.password,
                    get_profile_status: 'Loaded'
                })
            }.bind(this))
            .catch((error) => {
                handleError(this.props.dispatch, "Nelze načíst uživatelský profil", error);
            })
    }

    setProfile() {
        axios.put(Constants.baseURL + '/user', this.state.profile)
            .then(function (response) {
                this.setState({get_profile_status: 'Updated'});
                this.loadProfile();
                this.props.dispatch(setOKMessage("Profil změněn."))
            }.bind(this))
            .catch(function (error) {
                handleError(this.props.dispatch, "Nelze změnit profil", error);
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
        if (isValidationError(this.state.errorsProfile)) {
            this.setState({errors: {...this.state.errors}, show_validations: true});
            return;
        } else {
            this.setState({errors: {}, show_validations: false});
        }
        this.setProfile();
    }

    changePassword() {
        const config = {headers: {'Content-Type': 'application/json'}};
        axios.put(Constants.baseURL + '/user/password', {newPassword: this.state.password}, config)
            .then(function (response) {
                this.props.dispatch(setOKMessage("Heslo změněno."))
            }.bind(this))
            .catch(function (error) {
                handleError(this.props.dispatch, "Nelze změnit heslo", error);
            }.bind(this))
    }

    uploadAvatar(avatar64) {
        var fr = new FileReader();
        fr.addEventListener("load", function (e) {
            var resizedAvatar64 = resizeBase64Img(e.target.result, avatar64.files[0], Constants.avatarSize, Constants.avatarSize);
            this.sendProfileToServer(resizedAvatar64);
        }.bind(this));
        fr.readAsDataURL(avatar64.files[0]);
        console.log('uploa')
    }

    sendProfileToServer(avatar64) {
        const config = {headers: {'Content-Type': 'application/json'}};
        var avatar64noHeader = avatar64.split(",")[1];
        axios.post(Constants.baseURL + '/user/uploadAvatar', {base64: avatar64noHeader}, config)
            .then(function (response) {
                var newProfile = this.state.profile;
                newProfile.avatar = avatar64noHeader;
                this.setState({profile: newProfile});
            }.bind(this))
            .catch(function (error) {
                handleError(this.props.dispatch, "Obrázek se nepodařílo uložit", error);
            }.bind(this))
    }

    setValidationMessage(name, value) {
        if (value) {
            this.state.errorsProfile[name] = value;
        } else {
            this.state.errorsProfile[name] = null;
        }
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
                                        <label for="firstname">Jméno:</label>
                                        <ValidatedInput name="firstname" errors={this.state.errorsProfile} handleKeydown={this.handleKeydown.bind(this)}
                                                        setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.profile.firstname}
                                                        showValidation={this.state.show_validations}
                                                        conditions={{nonEmpty: true, minLength: 3}}/>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6">
                                        <label for="surname">Příjmení:</label>
                                        <ValidatedInput name="surname" errors={this.state.errorsProfile} handleKeydown={this.handleKeydown.bind(this)}
                                                        setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.profile.surname}
                                                        showValidation={this.state.show_validations}
                                                        conditions={{nonEmpty: true, minLength: 3}}/>
                                    </div>
                                    <br/>
                                    <div class="col-sm-6 col-md-6 col-lg-6">
                                        <label for="phone">Telefon:</label>
                                        <ValidatedInput name="phone" errors={this.state.errorsProfile} handleKeydown={this.handleKeydown.bind(this)}
                                                        setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.profile.phone}
                                                        showValidation={this.state.show_validations}
                                                        conditions={{nonEmpty: true, minLength: 8, onlyNumbers: true}}/>
                                        <label for="department">Oddělení:</label>
                                        <ValidatedInput name="department" errors={this.state.errorsProfile} handleKeydown={this.handleKeydown.bind(this)}
                                                        setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.profile.department}
                                                        showValidation={this.state.show_validations}
                                                        conditions={{nonEmpty: true, maxLength: 20}}/>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6">
                                        <ProfileImage uploadAvatar={this.uploadAvatar.bind(this)} avatar={this.state.profile.avatar}/>
                                    </div>
                                    <div class="col-sm-12 col-sm-offset-0 col-md-12 col-md-offset-0 col-lg-12 col-lg-offset-0">
                                        <label for="placeOfWork">Místo práce:</label>
                                        <ValidatedInput name="placeOfWork" errors={this.state.errorsProfile} handleKeydown={this.handleKeydown.bind(this)}
                                                        setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.profile.placeOfWork}
                                                        showValidation={this.state.show_validations}
                                                        conditions={{nonEmpty: true, maxLength: 20}}/>
                                        <label for="position">Pozice:</label>
                                        <ValidatedInput name="position" errors={this.state.errorsProfile} handleKeydown={this.handleKeydown.bind(this)}
                                                        setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.profile.position}
                                                        showValidation={this.state.show_validations}
                                                        conditions={{nonEmpty: true, maxLength: 20}}/>
                                        <label for="comment">Poznámka:</label>
                                        <ValidatedInput name="comment" errors={this.state.errorsProfile} handleKeydown={this.handleKeydown.bind(this)}
                                                        setValidationMessage={this.setValidationMessage.bind(this)} value={this.state.profile.comment}
                                                        showValidation={this.state.show_validations}
                                                        conditions={{nonEmpty: true, maxLength: 120}}/>
                                        <label for="carDescription">Popis auta:</label>
                                        <textarea rows="3" maxLength="1000" type="text" id="carDescription" class="form-control" name="carDescription" value={this.state.profile.carDescription} onChange={this.handleKeydown.bind(this)}/><br/>
                                        <button type="button" class="btn btn-default" onClick={this.submit.bind(this)}>Změnit</button>
                                        <br/>
                                    </div>
                                </div>
                            </div>
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
