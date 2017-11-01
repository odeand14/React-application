import _ from "lodash";
import React from "react";
import MonkeyListHeader from "./monkey-list-header.js";
import MonkeyListItem from "./monkey-list-item.js";

export default class MonkeyList extends React.Component {

    constructor(props) {

        super(props);

    }

    renderItems() {
        const props = _.omit(this.props, "monkeys"); 
        return this.props.filteredMonkeys.map((monkey, key) =>
            (<MonkeyListItem isLoggedIn={this.props.isLoggedIn} key={key} id={monkey._id} {...monkey} {...props} />));
    }


    render() {
        return(
            <table className="table ">
                <MonkeyListHeader/>
                {this.renderItems()}
            </table>

        );
    }
}