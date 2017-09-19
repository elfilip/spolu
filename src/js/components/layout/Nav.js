import React from "react";
import {NavLink, Link} from "react-router-dom";
import Logout from "../Logout";

export default class Nav extends React.Component {
    constructor() {
        super()
        this.state = {
            collapsed: true,
        };
    }

    toggleCollapse() {
        const collapsed = !this.state.collapsed;
        this.setState({collapsed});
    }

    render() {
        return (
            <div>
                <nav id="menu" class="navbar navbar-default">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <a class="navbar-brand" href="#">Spolujízda</a>
                        </div>
                        <ul class="nav navbar-nav">
                            <li>
                                <NavLink activeClassName="activeLink" to="/myRides" onClick={this.toggleCollapse.bind(this)}>Moje Jízdy</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="activeLink" to="/createRide" onClick={this.toggleCollapse.bind(this)}>Vytvořit Jizdu</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="activeLink" to="/searchRide" onClick={this.toggleCollapse.bind(this)}>Hledat Jízdu</NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="activeLink" to="/profile" onClick={this.toggleCollapse.bind(this)}>Profil</NavLink>
                            </li>
                        </ul>

                    <Logout/>
                    </div>
                </nav>
            </div>
        );
    }
}
