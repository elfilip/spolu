import React from "react";
import {connect} from "react-redux"

export default class RideProfileImage extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentWillMount() {

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
       else if (!profile.base64Image) {
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
                    <img src={"data:image/png;base64,"+profile.base64Image} class="rideProfileImage"/>
                </div>
            </div>
        }

        return (
            <div>
                {html}
            </div>
        )
    }
}



