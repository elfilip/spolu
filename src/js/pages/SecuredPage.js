import React from "react";
import axios from "axios"

export default class SecuredPage extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null,
        };
    }
    render() {
console.log(this.state.data)
        if(this.state.data === null){
        axios.get("http://localhost:8080/private/page",{withCredentials:true}).then( (response) => {
            console.log(response);
            this.setState({ data: response.data})
        })}
        return (
            <div>
                <h1>This page is secured</h1>
                <div>Secret Info!!!</div>
                <div>{this.state.data}</div>
            </div>
        );
    }
}
