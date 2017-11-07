import React from "react";
import CreateMonkey from "./create-monkey";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {


        let createMonkeyBar, searchbar, loginText, logOut;

        //TODO Change to usertoken or some

        if(this.props.isOnCreate) {
            createMonkeyBar = <div></div>;
            searchbar = <div></div>;
            loginText = "Home";
            logOut = <div></div>;

        } else if (this.props.loggedIn) {
            createMonkeyBar = <CreateMonkey
                monkeys={this.props.monkeys}
                createMonkey={this.props.createMonkey.bind(this)} />;
            searchbar = <li className="nav-item mx-2">
                            <input type="text" className="form-inline form-control" placeholder="Search on name" onChange={this.props.searchMonkeys.bind(this)}/>
                        </li>;
            loginText = "Join us";
            logOut = <li className="nav-item mx-2">
                <button className="btn btn-info" onClick={this.props.logOut}>Log Out</button>
            </li>
        } else {
            searchbar = <li className="nav-item mx-2">
                <input type="text" className="form-inline form-control" placeholder="Search on name" onChange={this.props.searchMonkeys.bind(this)}/>
            </li>;
            loginText = "Join us";
        }

        return(
            <nav className="navbar navbar-expand-lg mx-3 my-4">

                <ul className="navbar-nav mr-auto">
                    {createMonkeyBar}
                </ul>

                <ul className="navbar-nav ml-auto">

                    {searchbar}

                    <li className="nav-item active dropdown">
                        <button href="#" className="dropdown-toggle btn btn-info" ref="menu" data-toggle="dropdown">Login</button>
                        <div className="row dropdown-menu dropdown-menu-right" >
                            <form className="form mx-2" onSubmit={this.handleLogin.bind(this)} acceptCharset="UTF-8">
                                <div className="form-group">
                                    <label className="sr-only" htmlFor="exampleInputEmail2">Email address</label>
                                    <input type="email" className="form-control" ref="email" placeholder="Email address" required/>
                                </div>
                                <div className="form-group">
                                    <label className="sr-only" htmlFor="exampleInputPassword2">Password</label>
                                    <input type="password" className="form-control" ref="password" placeholder="Password" required/>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary btn-block">Sign in</button>
                                </div>
                            </form>
                            <div className="bottom text-center">
                                <button className="btn btn-info" onClick={this.props.setOnCreate}><b>{loginText}</b></button>
                            </div>
                        </div>
                    </li>

                    {logOut}

                    </ul>

            </nav>
        )
    }

    handleLogin(event) {

        event.preventDefault();
        const user = {
            email: this.refs.email.value,
            password: this.refs.password.value
        };

        this.props.login(user);

        this.refs.email.value = '';
        this.refs.password.value = '';
        this.refs.menu.click();

    }

}
