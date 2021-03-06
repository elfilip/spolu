import React from "react";
import {connect} from "react-redux"
import moment from "moment"
import cs from "moment/locale/cs"
import Datetime from "react-datetime";
import * as RideUtil from "../utils/RideUtil";


class DateTimePicker extends React.Component {
    constructor() {
        super();
        this.state = {
            address: "",
            moment: null,
        }
    }

    componentWillMount() {
        var momentx = moment();
        momentx.locale('cs');
       // this.setState({moment: momentx});
    }


    calendarChanged(date) {
        this.setState({moment: date});
        if (!date) {
            this.props.update(this.props.name, "");

        } else {
            this.props.update(this.props.name, date.utc().format());
        }
    }


    render() {
        return (

            <div class={this.props.classCss}>
                {!this.props.iconRight ? <span class="iconMargin glyphicon glyphicon-time"></span> : ""}
                <Datetime locale="cs"  class="inlineBlock" inputProps={{placeholder: this.props.placeholder}} value={this.state.moment} onChange={this.calendarChanged.bind(this)}/>
                {this.props.iconRight ? <span class="iconMargin glyphicon glyphicon-time"></span> : ""}

            </div>


        )
    }
}

export default connect(function (store) {
    return {}
})(DateTimePicker)




