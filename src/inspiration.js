import React from "react";
import InspirationListHeader from "./inspiration-header";
import InspirationListItem from "./inspiration-list-item";

export default class Inspiration extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            inspirationMonkeys: [],
            search: [],
        };

        this.state.inspirationMonkeys = this.props.inspirationMonkeys.filter(
            (monkey) => {
                return monkey.user.indexOf(this.props.user) !== 0;
            }
        ).slice(0, 10);




    }

    renderItems() {
        return this.state.inspirationMonkeys.sort((a, b) => {
            return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0);
        }).map((monkey, key) =>
            (<InspirationListItem key={key} id={monkey._id} {...monkey} />));
    }


    render() {
        return(
            <div className="container">
                <table className="table table-bordered table-hover table-sm">
                    <InspirationListHeader/>
                    {this.renderItems()}
                </table>
            </div>
        );
    }


}