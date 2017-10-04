import React from "react";
import PrivateRoute from "./PrivateRoute"
import Login from "./Login"
import {Route, Redirect} from "react-router-dom";
import Nav from "../components/layout/Nav"
import {connect} from "react-redux"
import Logout from "../components/Logout"
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {redirect, clear} from '../redux/SessionAction'
import {withRouter} from 'react-router-dom'
import Register from './Register'
import Main from './Main'
import Profile from "./Profile";
import CreateRide from "./CreateRide";
import MyRides from "./MyRides";
import RideDetail from "./RideDetail";
import SearchRide from "./SearchRide";
import FilipRoute from "./FilipRoute";
import ProfileRead from "./ProfileRead";


class Base extends React.Component {


    handleCancel = () => {
        this.props.dispatch(loginRedirect(false))
    };

    handleClose = () => {
        this.props.dispatch(clear())
        if (this.props.redirect === true) {
            this.props.history.push("/login");
        }
    };

    handleCloseLogout = () => {
        this.props.dispatch({type: 'LOGOUT'})    };

    componentWillUnmount() {
        console.log("unmounting")
        this.props.dispatch(clear());
    }

    render() {
        const actions = [
            <FlatButton
                label="OK"
                primary={true}
                onClick={this.handleClose}
            />,
        ];
        const redirectAction = [
            <FlatButton
                label="OK"
                primary={true}
                onClick={this.handleCloseLogout}
            />,
        ];
        var menu = this.props.authenticated ? <Nav/> : "";
        var logout = this.props.authenticated ? <Logout/> : "";
        console.log("base render " + this.props.authenticated)

        return (
            <div>
                <div>
                    {menu}
                    <PrivateRoute path="/main" authenticated={this.props.authenticated} component={Main}></PrivateRoute>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/register" component={Register}></Route>
                    <PrivateRoute path="/profile" authenticated={this.props.authenticated}
                                  component={Profile}></PrivateRoute>
                    <PrivateRoute path="/createRide" authenticated={this.props.authenticated}
                                  component={CreateRide}></PrivateRoute>
                    <PrivateRoute path="/myRides" authenticated={this.props.authenticated}
                                  component={MyRides}></PrivateRoute>
                    <PrivateRoute path="/rideDetail" authenticated={this.props.authenticated}
                                  component={RideDetail}></PrivateRoute>
                    <PrivateRoute path="/searchRide" authenticated={this.props.authenticated}
                                  component={SearchRide}></PrivateRoute>
                    <PrivateRoute path="/userProfile" authenticated={this.props.authenticated}
                                  component={ProfileRead}></PrivateRoute>

                    <Dialog
                        title="Chyba"
                        actions={actions}
                        modal={true}
                        open={this.props.error !== null && this.props.error_code != 403}
                    >
                        {this.props.error}
                    </Dialog>
                    <Dialog
                        title="Nepříhlášen"
                        actions={redirectAction}
                        modal={true}
                        open={this.props.error !== null && this.props.error_code == 403 }
                    >
                        Nejste příhlášen. Klikněte na OK pro přesměrování na přihlášení.
                    </Dialog>
                    <Dialog
                        title="OK"
                        actions={actions}
                        modal={true}
                        open={this.props.ok_message !== null}
                    >
                        {this.props.ok_message}
                    </Dialog>
                </div>

            </div>
        );
    }
}

export default withRouter(connect(function (store) {
    return {
        token: store.sessionReducer.token,
        authenticated: store.sessionReducer.authenticated,
        redirect: store.sessionReducer.redirect,
        error: store.sessionReducer.error,
        ok_message: store.sessionReducer.ok_message,
        error_code: store.sessionReducer.error_code,

    }
})(Base))


