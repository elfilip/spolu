import React from "react";
import {connect} from "react-redux"
import moment from "moment"
import cs from "moment/locale/cs"
import Datetime from "react-datetime";
import * as RideUtil from "../utils/RideUtil";


class RideDetailPair extends React.Component {
    constructor() {
        super();
        this.state = {}

    }

    render() {
        return (
                <div class="row">
                    <div class="col-sm-3 col-md-2 col-lg-2 ">
                        <span class="detailAddressLabel">{this.props.label}</span>
                    </div>
                    <div class="col-sm-9 col-md-10 col-lg-10 ">
                        <span class={this.props.iconClass}/>
                        <span class="address">{this.props.value}</span>
                    </div>
                </div>
        )
    }
}

export default connect(function (store) {
    return {}
})(RideDetailPair)




