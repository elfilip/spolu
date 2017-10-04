import React from "react";
import {connect} from "react-redux"
import axios from 'axios'
import Constants from '../utils/Constants'
import {setOKMessage} from "../redux/SessionAction";
import ProfileImage from "../components/ProfileImage";
import {handleError, resizeBase64Img} from "../utils/RideUtil";
import {getProfile} from "../redux/UserAction";
import queryString from "query-string";


class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            id: null,
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
            }
        }
    }

    componentDidUpdate() {
        let queryParams = queryString.parse(this.props.location.search);
        if (queryParams.id != this.state.id) {
            this.loadProfile();
            this.setState({id: queryParams.id})
        }
    }

    componentWillMount() {
        let queryParams = queryString.parse(this.props.location.search);
        this.loadProfile();
        this.setState({id: queryParams.id})

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
                                        <input type="text" id="firstName" class="form-control" name="firstname" value={this.state.profile.firstname} disabled/>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6">
                                        <label for="surname">Příjmení:</label>
                                        <input type="text" id="surName" class="form-control" name="surname" value={this.state.profile.surname} disabled/>
                                    </div>
                                    <br/>
                                    <div class="col-sm-6 col-md-6 col-lg-6">
                                        <label for="phone">Telefon:</label>
                                        <input type="text" id="phone" class="form-control" name="phone" value={this.state.profile.phone} disabled/><br/>
                                        <label for="department">Oddělení:</label>
                                        <input type="text" id="department" class="form-control" name="department" value={this.state.profile.department} disabled/><br/>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6">
                                        <ProfileImage notEditable={true} avatar={this.state.profile.avatar}/>
                                    </div>
                                    <div class="col-sm-12 col-sm-offset-0 col-md-12 col-md-offset-0 col-lg-12 col-lg-offset-0">
                                        <label for="placeOfWork">Místo práce:</label>
                                        <input type="text" id="placeOfWork" class="form-control" name="placeOfWork" value={this.state.profile.placeOfWork} disabled/><br/>
                                        <label for="position">Pozice:</label>
                                        <input type="text" id="position" class="form-control" name="position" value={this.state.profile.position} disabled/><br/>
                                        <label for="comment">Poznámka:</label>
                                        <input type="text" id="comment" class="form-control" name="comment" value={this.state.profile.comment} disabled/><br/>
                                        <label for="carDescription">Popis auta:</label>
                                        <textarea rows="3" type="text" id="carDescription" class="form-control" name="carDescription" value={this.state.profile.carDescription} disabled/><br/>
                                        <br/>
                                    </div>
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
