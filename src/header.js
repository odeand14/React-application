import React from "react";
import CreateMonkey from "./create-monkey";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {


        let createMonkeyBar, searchbar, logOut;

        if (this.props.loggedIn) {
            createMonkeyBar = <CreateMonkey
                monkeys={this.props.monkeys}
                createMonkey={this.props.createMonkey.bind(this)} />;
            searchbar = <li className="nav-item mx-2">
                            <input type="text" className="form-inline form-control" placeholder="Search on name" onChange={this.props.searchMonkeys.bind(this)}/>
                        </li>;
            logOut = <li className="nav-item mx-2">
                <span className="badge badge-info mx-2">Welcome, {this.props.user}!</span>
            <button className="btn btn-info" onClick={this.props.logOut}>Log Out</button>
            </li>
        } else {
            searchbar = <li className="nav-item mx-2">
                <input type="text" className="form-inline form-control" placeholder="Search on name" onChange={this.props.searchMonkeys.bind(this)}/>
            </li>;
        }

        return(
            <nav className="navbar navbar-expand-lg mx-3 my-4">

                <ul className="navbar-nav mr-auto">
                    {createMonkeyBar}
                </ul>

                <ul className="navbar-nav ml-auto">

                    {searchbar}

                    {logOut}

                </ul>

            </nav>
        )
    }

}
