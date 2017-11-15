import React, { Component } from 'react';
import _ from "lodash";
import Header from "./header";
import MonkeyList from "./monkey-list";
import Login from "./login";

class App extends Component {

constructor(props) {

	super(props);

	this.state = {
		monkeys: [],
		search: [],
		loggedIn: false,
		isOnCreate: false,
		user: "",
		userEmail: ""
	};

	if (localStorage.getItem("token")) {
		this.state.loggedIn = true;
		this.state.user = localStorage.getItem("userName");
		this.state.userEmail = localStorage.getItem("user");
	}

	if (this.state.loggedIn) {
		this.findUsersMonkeys(this.state.userEmail);
    }

}


	render() {

		let filteredMonkeys = this.state.monkeys.filter(
			(monkey) => {
				return monkey.name.toLowerCase().indexOf(this.state.search) !== -1;
			}
		);

        let appContent, header;

        if (!this.state.loggedIn) {
            appContent = <Login
				createUser={this.createUser.bind(this)}
				login={this.login.bind(this)}
				findUsersMonkeys={this.findUsersMonkeys.bind(this)}/>;
			header = <div></div>
        } else {
            appContent = <MonkeyList
				filteredMonkeys={filteredMonkeys}
				saveMonkey={this.saveMonkey.bind(this)}
				deleteMonkey={this.deleteMonkey.bind(this)}
				isLoggedIn={this.state.loggedIn}
			/>;
			header = <Header
				user ={this.state.user}
				logOut={this.logOut.bind(this)}
				loggedIn={this.state.loggedIn}
				monkeys={this.state.monkeys}
				createMonkey={this.createMonkey.bind(this)}
				searchMonkeys={this.searchMonkeys.bind(this)}
			/>
        }

        return (

			<div className="App">
				{header}
				{appContent}
			</div>

		);
	}

	isLoggedIn() {
		return this.state.loggedIn;
	}


	searchMonkeys(event) {
        this.setState({search: event.target.value.substr(0, 20)});
	}

	createMonkey(monkey) {

			fetch("/monkeys", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					'Authorization': localStorage.getItem("token")
				},
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

        fetch("/users", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(user)
        }).then(response => response.json())
            .catch(err => document.write(err));
    }

    login(user) {
        fetch("/login", {
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
					localStorage.setItem('user', json.user.email);
					this.setState({userEmail: json.user.email});
                    localStorage.setItem('userName', json.user.name);
                    this.setState({user: json.user.name})
            	}
        	})
			.catch(err => document.write(err));

	}

	logOut() {
		this.setState({loggedIn: false});
		localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
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

		fetch(`/monkeys/${monkeyToDelete}`, {
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

	findUsersMonkeys(user) {

        fetch(`/monkeys/${user}`)
            .then(response => response.json())
            .then(monkeys => this.setState({
                monkeys: monkeys
            })).catch(err => document.write(err));
	}

	updateMonkey(monkeyToUpdate, updatedMonkey) {

        fetch(`/monkeys/${monkeyToUpdate}`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
			body: JSON.stringify(updatedMonkey)
        }).catch(err => document.write(err));

    }


}

export default App;
