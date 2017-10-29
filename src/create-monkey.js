import React from "react";
import _ from "lodash";

export default class CreateMonkey extends React.Component {

    constructor(props) {

        super(props);
        
        this.state = {
            error: null
        };

    }

    renderError() {
        if(!this.state.error) {return null;}
        return <div style={{ color: "red"}}>{this.state.error}</div>
    }

    render() {
        return(
            <form className="form-inline mx-3 my-3" onSubmit={this.handleCreate.bind(this)}>
                <input className="form-control mx-1" type="text" placeholder="name" ref="name"/>
                <input className="form-control mx-1" type="text" placeholder="race" ref="race" />
                <button className="btn btn-primary mx-1">Create</button>
                {this.renderError()}
            </form>
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
        if (!monkey.name) {
            return "Please enter name!";
        } else if (!monkey.race) {
            return "Please enter race!";
        } else if (_.find(this.props.monkeys, tmpMonkey => tmpMonkey.name === monkey.name)) {
            return "Monkey exists already!";
        } else return null;
    }


}