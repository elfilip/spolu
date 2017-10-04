import React from "react";
import {connect} from "react-redux"
import {createHashHistory} from "history";
const history = createHashHistory();
export default class RideProfileImage extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentWillMount() {

    }

    handleClick(target){
     //   history.push('/userProfile?id='+this.props.profile.userId);
          history.push('/userProfile?id=1');
    }

    render() {

        var html;
        var profile=this.props.profile;
        if(!profile){
            <div>
                <div class="rideProfileContainer">
                    <span class="glyphicon glyphicon-user profileDefault"></span>
                    řidič neznámý
                </div>
            </div>
        }
       else if (!profile.avatarBase64) {
            html =
                <div>
                    <div class="rideProfileContainer">
                        <span class="glyphicon glyphicon-user profileDefault"></span>
                        {profile.firstname} {profile.surname}
                    </div>
                </div>
        } else {
            html = <div>
                <div class="rideProfileContainer">
                    <img src={"data:image/png;base64,"+profile.avatarBase64} class="rideProfileImage"/>
                    {profile.firstname} {profile.surname}
                </div>
            </div>
        }

        return (
            <div onClick={this.handleClick.bind(this)}>
                {html}
            </div>
        )
    }
}



