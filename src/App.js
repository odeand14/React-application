import React, { Component } from 'react';
import _ from "lodash";
import CreateMonkey from "./create-monkey.js";
import Header from "./header";
import MonkeyList from "./monkey-list";
import CreateUser from "./create-user";



class App extends Component {

constructor(props) {
	super(props);

	this.state = {
		monkeys: [],
		search: [],
		isOnCreate: false
	};

	fetch("http://localhost:1234/monkeys")
		.then(response => response.json())
		.then(monkeys => this.setState({
		monkeys: monkeys
	})).catch(err => document.write(err));

}


	render() {

		let filteredMonkeys = this.state.monkeys.filter(
			(monkey) => {
				return monkey.name.toLowerCase().indexOf(this.state.search) !== -1;
			}
		);

        let appContent;
        if (this.state.isOnCreate) {
            appContent = <CreateUser/>
        } else {
            appContent = <MonkeyList
				filteredMonkeys={filteredMonkeys}
				saveMonkey={this.saveMonkey.bind(this)}
				deleteMonkey={this.deleteMonkey.bind(this)}
			/>
        }

        return (

			<div className="App">
				<Header
					isOnCreate={this.state.isOnCreate}
					monkeys={this.state.monkeys}
					createMonkey={this.createMonkey.bind(this)}
					history={this.props.history}
					searchMonkeys={this.searchMonkeys.bind(this)}
					setOnCreate={this.setOnCreate.bind(this)}/>
				{appContent}
				<hr/>
			</div>

		);
	}

	setOnCreate() {
		this.setState({isOnCreate: !this.state.isOnCreate});
	}

	searchMonkeys(event) {
        this.setState({search: event.target.value.substr(0, 20)});
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
		this.updateMonkey(oldMonkey.id, newMonkey);
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

	updateMonkey(monkeyToUpdate, updatedMonkey) {

        fetch(`http://localhost:1234/monkeys/${monkeyToUpdate}`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
			body: JSON.stringify(updatedMonkey)
        }).catch(err => document.write(err));

    }

}

export default App;
