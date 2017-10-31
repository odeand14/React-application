import React from "react";
import _ from "lodash";

export default class CreateUser extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            error: null
        };

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
        const monkey = {
            name: this.refs.name.value,
            race: this.refs.race.value,

        };
        const validateInput = this.validateInput(monkey);

        if(validateInput) {
            this.setState({error: validateInput});
            return;
        }

        this.props.createMonkey(monkey);
        this.setState({error: null});
        this.refs.name.value = '';
        this.refs.race.value = '';
    }

    validateInput(monkey) {
        if (_.find(this.props.monkeys, tmpMonkey => tmpMonkey.name === monkey.name)) {
            return "Monkey exists already!";
        } else return null;
    }


}