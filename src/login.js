import React from "react";

export default class Login extends React.Component{

    constructor(props) {
        super(props);
    }


    render() {

        return(
            <div className="container">
                <div className="text-center my-3">
                    <h1>Welcome to da monkeypage!</h1>
                </div>
                <hr/>
                <div className="row">
                    <div className="justify-content-center col-4 mx-3 my-5">
                        <form onSubmit={this.handleCreate.bind(this)} acceptCharset="UTF-8">
                            <h3 className="my-3">New user?</h3>
                            <div className="form-group">
                                <label className="form-control-label">Name:</label>
                                <input id="newName" className="form-control" type="text" placeholder="Name" ref="name" required/>
                                <small className="form-text text-muted">Example: Firstname Lastname</small>
                            </div>
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="newEmail">Email:</label>
                                <input id="newEmail" className="form-control form-control-danger" type="email" placeholder="e-mail" ref="email" required/>
                                <small className="form-text text-muted">Example: youremail@something.com</small>
                            </div>
                            <div className="form-group">
                                <label className="form-control-label">Password:</label>
                                <input id="newPass" className="form-control" type="password" placeholder="Password" ref="password" required/>
                                <small className="form-text text-muted">Example: No examples here! Youre on your own ;)</small>
                            </div>
                            <div className="form-group">
                                <label className="form-control-label">Repeat password:</label>
                                <input id="repeatPass" className="form-control" type="password" placeholder="Repeat password" ref="repeat" required/>
                                <small className="form-text text-muted">Same input as above</small>
                            </div>
                            <div className="text-center">
                                <button className="btn btn-primary mx-1 my-2 text-center">Create</button>
                            </div>
                        </form>
                    </div>

                    <div className="justify-content-center col-4 mx-3 my-5">
                        <form className="" onSubmit={this.handleLogin.bind(this)} acceptCharset="UTF-8">
                            <h3 className="my-3">Existing user?</h3>
                            <div className="form-group has-success">
                                <label className="form-control-label" htmlFor="exampleInputEmail2">Email:</label>
                                <input id="oldEmail" type="email" className="form-control" ref="email" placeholder="e-mail" required/>
                                <small className="form-text text-muted">Example: youremail@something.com</small>
                            </div>
                            <div className="form-group">
                                <label className="form-control-label" htmlFor="exampleInputPassword2">Password:</label>
                                <input id="oldPass" type="password" className="form-control" ref="password" placeholder="password" required/>
                                <small className="form-text text-muted">Example: No examples here! Youre on your own ;)</small>
                            </div>
                            <div className="form-group text-center">
                                <button type="submit" className="btn btn-info mx-1 my-2 text-center">Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
                <hr/>
            </div>
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

    }

    handleCreate(event) {
        event.preventDefault();


        const user = {
            name: this.refs.name.value,
            email: this.refs.email.value,
            password: this.refs.password.value
        };

        this.props.createUser(user);

        this.refs.name.value = '';
        this.refs.email.value = '';
        this.refs.password.value = '';
    }

}