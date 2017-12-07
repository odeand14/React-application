import React from "react";
import InspirationListHeader from "./inspiration-header";
import InspirationListItem from "./inspiration-list-item";

export default class Inspiration extends React.Component {

    constructor(props) {
        super(props);
        this.props.findPublicMonkeys();
    }

    renderItems() {
         return this.props.publicMonkeys.map((monkey, key) =>
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