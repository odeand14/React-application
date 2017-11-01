import React from "react";

export default class CreateUser extends React.Component {

    constructor(props) {

        super(props);

    }

    render() {
        return(
            <div>
                <hr/>
                <div className="container justify-content-center col-4">
                    <form className="mx-3 my-5" onSubmit={this.handleCreate.bind(this)}>
                        <input className="form-control mx-1 my-2" type="text" placeholder="Name" ref="name" required/>
                        <input className="form-control mx-1 my-2" type="email" placeholder="e-mail" ref="email" required/>
                        <input className="form-control mx-1 my-2" type="password" placeholder="Password" ref="password" required/>
                        <div className="text-center">
                            <button className="btn btn-primary mx-1 my-2 text-center">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )

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