import React from "react";
import { NavLink, Link } from "react-router-dom";

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
            <ul >
              <li >
                <NavLink activeStyle={{color : 'red'}} to="/myRides" onClick={this.toggleCollapse.bind(this)}>Moje Jízdy</NavLink>
              </li>
              <li >
                <NavLink activeStyle={{color : 'red'}} to="/createRide" onClick={this.toggleCollapse.bind(this)}>Vytvořit Jizdu</NavLink>
              </li>
              <li >
                <NavLink activeStyle={{color : 'red'}} to="/searchRide" onClick={this.toggleCollapse.bind(this)}>Hledat Jízdu</NavLink>
              </li>
              <li >
                <NavLink activeStyle={{color : 'red'}} to="/profile" onClick={this.toggleCollapse.bind(this)}>Profil</NavLink>
              </li>
            </ul>
          </div>
    );
  }
}
