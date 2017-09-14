import React from "react";
import {connect} from "react-redux"

class Main extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        console.log(this.props.authenticated)
      return (
          <div>Main Page</div>
      )
    }
}

export default connect(function (store) {
    return {
        error: store.sessionReducer.error,
        isLogged: store.sessionReducer.authenticated
    }
})(Main)
