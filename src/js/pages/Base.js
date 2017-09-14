import React from "react";
import PrivateRoute from "./PrivateRoute"
import Login from "./Login"
import {Route, Redirect} from "react-router-dom";
import Nav from "../components/layout/Nav"
import {connect} from "react-redux"
import Logout from "./Logout"
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
        var menu = this.props.authenticated ? <Nav/> : "";
        var logout = this.props.authenticated ? <Logout/> : "";
        console.log("base render " + this.props.authenticated)
        return (
            <div>
                <div>
                    {logout}
                    {menu}
                    <FilipRoute path="/main" authenticated={this.props.authenticated} component={Main}></FilipRoute>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/register" component={Register}></Route>
                    <FilipRoute path="/profile" authenticated={this.props.authenticated}
                                  component={Profile}></FilipRoute>
                    <FilipRoute path="/createRide" authenticated={this.props.authenticated}
                                  component={CreateRide}></FilipRoute>
                    <FilipRoute path="/myRides" authenticated={this.props.authenticated}
                                  component={MyRides}></FilipRoute>
                    <FilipRoute path="/rideDetail" authenticated={this.props.authenticated}
                                  component={RideDetail}></FilipRoute>
                    <FilipRoute path="/searchRide" authenticated={this.props.authenticated}
                                  component={SearchRide}></FilipRoute>

                    <Dialog
                        title="Alert"
                        actions={actions}
                        modal={true}
                        open={this.props.error !== null}
                    >
                        {this.props.error}
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
    }
})(Base))


