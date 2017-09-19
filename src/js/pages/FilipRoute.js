import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { createHashHistory } from 'history';
const history = createHashHistory()
/*
export default function PrivateRoute ({component: Component, authenticated, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authenticated == true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        />
    )
}
*/

export default class FilipRoute extends React.Component{

    render(){
        var props=this.props;
        console.log("FilipRoute " +props.authenticated)
        var html=<Route {...props} render={(props) => {
            console.log("Router " +this.props.authenticated)
            var isLogged=this.props.authenticated;
            var Component=this.props.component2;
            if(isLogged === true){
                return <Component {...this.props}/>
            }else{
                return  <Redirect to="/login"/>
            }
        }}/>
        return (
            <div>
            {html}
            </div>
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
