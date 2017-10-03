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
        this.setState({moment: momentx});
    }


    calendarChanged(date) {
        this.setState({moment: date});
        this.props.update(this.props.name, date.utc().format());
    }


    render() {
        return (

            <span style={{float: 'right'}}>
                <span class="iconMargin glyphicon glyphicon-time"></span>
                        <div class={this.props.class}>
                        <span class="iconMargin glyphicon glyphicon-time"></span>
                            {RideUtil.formatDate(this.props.data)}
                    </div>
            </span>


        )
    }
}

export default connect(function (store) {
    return {}
})(DateTimePicker)




