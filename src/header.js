import React from "react";

export default class Header extends React.Component {

    render() {

        return(
                <div className="row mx-3 my-3">

                        <div>
                            <form className="form-inline" role="search">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Search"/>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="form-control btn btn-primary mx-2">Submit</button>
                                </div>
                            </form>
                        </div>

                        <div className="text-right">
                            <ul className="nav d-inline">
                                <li className="dropdown">
                                    <button href="#" className="dropdown-toggle btn btn-primary" data-toggle="dropdown">Login</button>
                                    <ul id="login-dp" className="dropdown-menu">
                                        <li>
                                            <div className="row mx-1">
                                                <div className="">
                                                    <form className="form" method="post" action="login" acceptCharset="UTF-8" id="login-nav">
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
                                                    New here ? <a href="#"><b>Join Us</b></a>
                                                </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
            </div>
        )
    }
}

