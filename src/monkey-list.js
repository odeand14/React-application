import _ from "lodash";
import React from "react";
import MonkeyListHeader from "./monkey-list-header.js";
import MonkeyListItem from "./monkey-list-item.js";

export default class MonkeyList extends React.Component {

    renderItems() {
        const props = _.omit(this.props, "monkeys"); 
        //return _.map(this.props.monkeys, monkey => <MonkeyListItem key={index} {...monkey} />);
        return this.props.monkeys.map((monkey, key) => (<MonkeyListItem key={key} {...monkey} {...props} />));
    }


    render() {
        return(
            <table>
                <MonkeyListHeader/>
                {this.renderItems()}
            </table>

        );
    }
}