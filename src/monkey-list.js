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
            <div className="container">
                <table className="table table-bordered table-hover table-sm">
                    <MonkeyListHeader/>
                    {this.renderItems()}
                </table>
            </div>
        );
    }
}