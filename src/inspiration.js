import React from "react";

export default class Inspiration extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            inspirationMonkeys: this.props.findPublicMonkeys(),
            search: [],

        };




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