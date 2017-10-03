import React from "react";
import {connect} from "react-redux"

class ProfileImage extends React.Component {
    constructor() {
        super();
        this.state = {
            imageUpdated: false,
        }
    }

    componentWillMount() {

    }


    handleChange(aaa) {
        console.log(aaa)
    }

    handleSave(aaa) {
        console.log(aaa)
    }

    uploadAvatar(avatar) {
        if (!this.state.imageUpdated) {
            avatar.target.addEventListener('change', this.uploadAvatar.bind(this), false)
            this.setState({imageUpdated: true})
        }
        this.props.uploadAvatar(avatar.target);
        console.log("uploadinProfileImage")
    }

    clearInputFile(event) {
        event.target.value = null;
    }

    render() {

        var html;
        if (!this.props.avatar) {
            html =
                <div class="profileImageContainer">
                    <div class="">
                        <span class="glyphicon glyphicon-user profileDefault"></span>
                    </div>
                    <input class="profileDefault" type="file" onChange={this.uploadAvatar.bind(this)} onClick={this.clearInputFile.bind(this)}/>
                </div>
        } else {
            html = <div  class="profileImageContainer">
                <div class="">
                    <img class='profileImage' src={"data:image/png;base64,"+this.props.avatar}/>
                </div>
                <input class="profileDefault" type="file" onChange={this.uploadAvatar.bind(this)} onClick={this.clearInputFile.bind(this)}/>
            </div>
        }

        return (
            <div class="flexbox">
                {html}
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
})(ProfileImage)


