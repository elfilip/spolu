import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component:C, authenticated, ...rest }) => (
    <Route {...rest} render={props => (
        authenticated == true
            ? <C {...props} />
            : <Redirect to="/login"/>
    )}/>
);

