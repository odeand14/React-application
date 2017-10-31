import React from "react";
import CreateMonkey from "./create-monkey";

export default class Header extends React.Component {


    render() {


        let createMonkeyBar;

        if(this.props.isOnCreate) {
            createMonkeyBar = <div></div>
        } else {
            createMonkeyBar = <CreateMonkey
                monkeys={this.props.monkeys}
                createMonkey={this.props.createMonkey.bind(this)} />;
        }

        return(
            <nav className="navbar navbar-expand-lg mx-3 my-4">

                <ul className="navbar-nav mr-auto">
                    {createMonkeyBar}
                </ul>

                <ul className="navbar-nav ml-auto">

                    <li className="nav-item mx-2">
                        <input type="text" className="form-inline form-control" placeholder="Search on name" onChange={this.props.searchMonkeys.bind(this)}/>
                    </li>

                    <li className="nav-item active dropdown">
                        <button href="#" className="dropdown-toggle btn btn-info" data-toggle="dropdown">Login</button>
                        <div className="row dropdown-menu dropdown-menu-right" id="login-dp">
                            <form className="form mx-2" method="post" action="login" acceptCharset="UTF-8" id="login-nav">
                                <div className="form-group">
                                    <label className="sr-only" htmlFor="exampleInputEmail2">Email address</label>
                                    <input type="email" className="form-control" id="inputEmail" placeholder="Email address" required/>
                                </div>
                                <div className="form-group">
                                    <label className="sr-only" htmlFor="exampleInputPassword2">Password</label>
                                    <input type="password" className="form-control" id="inputPassword" placeholder="Password" required/>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary btn-block">Sign in</button>
                                </div>
                            </form>
                            <div className="bottom text-center">
                                New here ? <button className="btn btn-info" onClick={this.props.setOnCreate}><b>Join Us</b></button>
                            </div>
                        </div>
                    </li>
                </ul>

            </nav>
        )
    }
}
