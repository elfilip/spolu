import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class FilipRoute extends React.Component{

    render(){
        var props=this.props;
        console.log("aaa" +props.authenticated)
        return (
            <Route {...props} render={props => (
                props.authenticated == true
                    ? <C {...props} />
                    : <Redirect to="/login"/>
            )}/>
        )
    }
}

/*
export default ({ component:C, authenticated, ...rest }) => (
    <Route {...rest} render={props => (
        authenticated == true
            ? <C {...props} />
            : <Redirect to="/login"/>
    )}/>
);
*/