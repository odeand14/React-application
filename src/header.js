import React from "react";
import CreateMonkey from "./create-monkey";

export default class Header extends React.Component {

    render() {

        let createMonkeyBar, searchbar, logOut, switchPage;

        if (this.props.isOnInspiration) {
            createMonkeyBar = <li className="nav-item mx-2"><h3>Inspiration</h3></li>;
            searchbar = null;
            logOut = <li className="nav-item mx-2">
                <button className="btn btn-info" onClick={this.props.logOut}>Log Out</button>
            </li>;
            switchPage = <li className="nav-item mx-2">
                <button onClick={this.props.goToInspirationSite.bind(this)} className="badge badge-info">Welcome, {this.props.user}!<br/>Click for Homepage</button>

            </li>

        } else if (this.props.loggedIn) {
            createMonkeyBar = <CreateMonkey
                monkeys={this.props.monkeys}
                createMonkey={this.props.createMonkey.bind(this)} />;
            searchbar = <li className="nav-item mx-2">
                            <input type="text" className="form-inline form-control" placeholder="Search on name" onChange={this.props.searchMonkeys.bind(this)}/>
                        </li>;
            logOut = <li className="nav-item mx-2">
                        <button className="btn btn-info" onClick={this.props.logOut}>Log Out</button>
                    </li>;
            switchPage = <li className="nav-item mx-2">
                <button onClick={this.props.goToInspirationSite.bind(this)} className="badge badge-info">Welcome, {this.props.user}!<br/>Click for Inspiration</button>
            </li>
        }

        return(
            <nav className="navbar navbar-expand-lg mx-3 my-4">

                <ul className="navbar-nav mr-auto">
                    {createMonkeyBar}
                </ul>

                <ul className="navbar-nav ml-auto">

                    {searchbar}
                    {switchPage}
                    {logOut}

                </ul>

            </nav>
        )
    }

}
