import React, { Component } from 'react';
import _ from "lodash";
import Header from "./header";
import MonkeyList from "./monkey-list";
import CreateUser from "./create-user";

class App extends Component {

constructor(props) {
    const username = "jonnybananas";
    const password = "Apeloff";
    const dbUri = `mongodb://${username}:${password}@ds161455.mlab.com:61455/monkeydatabase`;

	super(props);

	this.state = {
		monkeys: [],
		search: [],
		loggedIn: false,
		isOnCreate: false
	};

	if (localStorage.getItem("token")) {
		this.state.loggedIn = true;
	}

	fetch(dbUri + "/monkeys")
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
            appContent = <CreateUser
				createUser={this.createUser.bind(this)}/>
        } else {
            appContent = <MonkeyList
				filteredMonkeys={filteredMonkeys}
				saveMonkey={this.saveMonkey.bind(this)}
				deleteMonkey={this.deleteMonkey.bind(this)}
				isLoggedIn={this.state.loggedIn}
			/>
        }

        return (

			<div className="App">
				<Header
					logOut={this.logOut.bind(this)}
					loggedIn={this.state.loggedIn}
					login={this.login.bind(this)}
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

	isLoggedIn() {
		return this.state.loggedIn;
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
				headers: {"Content-type": "application/json", 'Authorization': localStorage.getItem("token")},
				body: JSON.stringify(monkey)
			}).then(response => response.json())
				.then(json => {
					if (json.message !== undefined) {
                        alert(json.message);
					} else {
                        this.setState(prevState => ({monkeys: [...prevState.monkeys, json]}))
                    }
				})
				.catch(err => document.write(err));
	}

    createUser(user) {

        fetch("http://localhost:1234/users", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(user)
        }).then(response => response.json())
            .catch(err => document.write(err));
    }

    login(user) {
        fetch("http://localhost:1234/login", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(user)
        }).then(response => response.json())
			.then(json => {
                if (json.message !== undefined) {
                    alert(json.message);
                } else {
					localStorage.setItem('token', json.token);
					this.setState({loggedIn: true});
					localStorage.setItem('user', JSON.stringify(json.user.email));
            	}
        	})
			.catch(err => document.write(err));

	}

	logOut() {
		this.setState({loggedIn: false});
		localStorage.removeItem("token");
        localStorage.removeItem("user");
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
		}).then(response => response.json())
            .then(json => {
                console.log(json.message);
                if (json.message !== undefined) {
                    alert(json.message);
                } else {
                    _.remove(this.state.monkeys, monkey => monkey._id === monkeyToDelete);
                    this.setState({ monkeys: this.state.monkeys });
                }
            })
			.catch(err => document.write(err));


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
