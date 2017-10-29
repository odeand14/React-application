import React, { Component } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import _ from "lodash";
import MonkeyList from "./monkey-list.js";
import CreateMonkey from "./create-monkey.js";
import Header from "./header";

class App extends Component {

constructor(props) {
	super(props);

	this.state = {
		monkeys: []
	};

	fetch("http://localhost:1234/monkeys")
		.then(response => response.json())
		.then(monkeys => this.setState({
		monkeys: monkeys
	})).catch(err => document.write(err));

}


	render() {
		return (

			<div className="App">
				<Header/>
				<div className="scrollBar">
				<MonkeyList
					monkeys={this.state.monkeys}
					saveMonkey={this.saveMonkey.bind(this)}
					deleteMonkey={this.deleteMonkey.bind(this)} />
				</div>
				<hr/>
				<CreateMonkey isSticky={true} monkeys={this.state.monkeys} createMonkey={this.createMonkey.bind(this)} />
			</div>

		);
	}

	createMonkey(monkey) {

		fetch("http://localhost:1234/monkeys", {
			method: "POST",
			headers: {"Content-type": "application/json"},
			body: JSON.stringify(monkey)
		}).then(response => response.json())
			.then(json => {this.setState(prevState => ({monkeys: [...prevState.monkeys, json]}))})
			.catch(err => document.write(err));

	}

    saveMonkey(oldMonkey, newMonkey) {

        this.updateMonkey(oldMonkey);

        let newMonkeyState = this.state.monkeys.map(monkey => {
            if (monkey.name === oldMonkey.name) {
                if(monkey.name !== "") {
                    monkey.name = newMonkey.name;
                }
                if(monkey.race !== "") {
                    monkey.race = newMonkey.race;
                }
            }
            return monkey;
        });
        this.setState(prevState => ({
            monkeys: newMonkeyState
        }));
    }
	
	deleteMonkey(monkeyToDelete) {

		fetch(`http://localhost:1234/monkeys/${monkeyToDelete}`, {
			method: "DELETE",
			headers: {"Content-type": "application/json"},
		}).catch(err => document.write(err));

        _.remove(this.state.monkeys, monkey => monkey._id === monkeyToDelete);
        this.setState({ monkeys: this.state.monkeys });
	}

	updateMonkey(monkeyToUpdate) {

        fetch(`http://localhost:1234/monkeys/${monkeyToUpdate}`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
        }).catch(err => document.write(err));

    }

}

export default App;
