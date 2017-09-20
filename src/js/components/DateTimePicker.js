import React from "react";
import {connect} from "react-redux"
import moment from "moment"
import cs from "moment/locale/cs"
import Datetime from "react-datetime";


class DateTimePicker extends React.Component {
    constructor() {
        super();
        this.state = {
            address: "",
            moment: null,
        }
    }

    componentWillMount(){
            var momentx = moment();
            momentx.locale('cs');
            this.setState({moment: momentx});
    }


    calendarChanged(date){
        this.setState({moment:date})
    }

    render() {
        return (
            <div>
                <span class="iconMargin glyphicon glyphicon-time"></span>
                <Datetime class="inlineBlock" inputProps={{ placeholder: 'blah'}} value={this.state.moment} onChange={this.calendarChanged.bind(this)}/>
            </div>
        )
    }
}

export default connect(function (store) {
    return {

    }
})(DateTimePicker)




