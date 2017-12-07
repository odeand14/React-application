import React, { Component } from 'react';
import _ from "lodash";
import Header from "./header";
import MonkeyList from "./monkey-list";
import Login from "./login";
import Inspiration from "./inspiration";

class App extends Component {

constructor(props) {

	super(props);

	if (localStorage.getItem("token")) {
	    this.state= {
            monkeys: [],
            search: [],
            loggedIn: true,
            isOnInspiration: false,
            user: localStorage.getItem("userName"),
            userEmail: localStorage.getItem("user"),
            inspirationMonkeys: [],
            token: localStorage.getItem("token"),
        }
	} else {
        this.state = {
            monkeys: [],
            search: [],
            loggedIn: false,
            isOnInspiration: false,
            user: "",
            userEmail: "",
            inspirationMonkeys: [],
            token: ""
        };
    }

    if (this.state.loggedIn) {
		this.findUsersMonkeys(this.state.userEmail);
    }

}

    componentWillMount() {
        const connection =
			new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://")
			+ window.location.host + "/ws");

        connection.onmessage = (json) => {
        	let monkeyToHandle = JSON.parse(json.data);
            this.updateInspirationalMonkeys(monkeyToHandle);
        }
    }



	render() {
        let filteredMonkeys = {};
        if (this.state.monkeys.length > 0) {
            filteredMonkeys = this.state.monkeys.filter(
                (monkey) => {
                    return monkey.name.toLowerCase().indexOf(this.state.search) !== -1;
                }
            );
        }

		let publicMonkeys = this.state.inspirationMonkeys.filter(
            (monkey) => {
                return monkey.user.indexOf(this.state.userEmail) !== 0;
            }
        ).sort((a, b) => {
            return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0);
        }).slice(0, 10);

        let appContent, header;

        if (!this.state.loggedIn) {
            appContent = <Login
				createUser={this.createUser.bind(this)}
				login={this.login.bind(this)}
                />;
			header = null
        } else if (!this.state.isOnInspiration) {
            appContent = <MonkeyList
                monkeys={this.state.monkeys}
				filteredMonkeys={filteredMonkeys}
				saveMonkey={this.saveMonkey.bind(this)}
				deleteMonkey={this.deleteMonkey.bind(this)}
				isLoggedIn={this.state.loggedIn}
                userEmail={this.state.userEmail}
                findUsersMonkeys={this.findUsersMonkeys.bind(this)}
				savePublicMonkey={this.savePublicMonkey.bind(this)}
				sendPublicMonkey={this.sendPublicMonkey.bind(this)}
			/>;
			header = <Header
				isOnInspiration={this.state.isOnInspiration}
				goToInspirationSite={this.goToInspirationSite.bind(this)}
				user={this.state.user}
				logOut={this.logOut.bind(this)}
				loggedIn={this.state.loggedIn}
				monkeys={this.state.monkeys}
				createMonkey={this.createMonkey.bind(this)}
				searchMonkeys={this.searchMonkeys.bind(this)}
			/>
        } else {
			header = <Header
				isOnInspiration={this.state.isOnInspiration}
				goToInspirationSite={this.goToInspirationSite.bind(this)}
				user={this.state.user}
				logOut={this.logOut.bind(this)}
				loggedIn={this.state.loggedIn}
				/>;
        	appContent = <Inspiration
                findPublicMonkeys={this.findPublicMonkeys.bind(this)}
				publicMonkeys={publicMonkeys}
				user={this.state.userEmail}/>
		}

        return (

			<div className="App">
				{header}
				{appContent}
			</div>

		);
	}

	updateInspirationalMonkeys(monkeyToHandle) {

        const index = this.state.inspirationMonkeys.findIndex(x => x._id === monkeyToHandle._id);
        let newMonkeyState = this.state.inspirationMonkeys;

        if (index === -1) {
            newMonkeyState.push(monkeyToHandle);
            this.setState(prevState => ({
                inspirationMonkeys: newMonkeyState
            }));
        } else {
            newMonkeyState.splice(index,1);
            this.setState(prevState => ({
                inspirationMonkeys: newMonkeyState
            }));

        }

	}

	goToInspirationSite() {
		this.setState({isOnInspiration: !this.state.isOnInspiration});
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
                'Authorization': [this.state.token, monkey.user]
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
			.then(json => {
                if (json.message !== undefined) {
                    alert(json.message);
                } else {
                	const newUser = {email: user.email, password: user.password};
                	this.login(newUser);
				}
			})
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
					this.setState({token: json.token});
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
        this.setState({isOnInspiration: false});
        this.setState({monkeys: [], inspirationMonkeys: [], user: "", userEmail: ""});
		localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
	}

    saveMonkey(oldMonkey, newMonkey) {
        let nMonkey = "";
        let newMonkeyState = this.state.monkeys.map(monkey => {
            if (monkey._id === oldMonkey.id) {
                if(monkey.name !== "") {
                    monkey.name = newMonkey.name;
                }
                if(monkey.race !== "") {
                    monkey.race = newMonkey.race;
                }
                monkey.isPublic = newMonkey.isPublic;
                nMonkey = monkey;
            }
            return monkey;
        });
		this.updateMonkey(oldMonkey, newMonkey);
        this.setState(prevState => ({
            monkeys: newMonkeyState
        }));
        this.sendPublicMonkey(nMonkey);
    }
	
	deleteMonkey(monkeyToDelete) {
		fetch(`/monkeys/${monkeyToDelete.id}`, {
			method: "DELETE",
			headers: {
			    "Content-type": "application/json",
                'Authorization': [this.state.token, monkeyToDelete.user]}
		}).then(response => response.json())
            .then(json => {
                if (json.message !== undefined) {
                    alert(json.message);
                } else {
                    _.remove(this.state.monkeys, monkey => monkey._id === monkeyToDelete.id);
                    this.setState({ monkeys: this.state.monkeys });
                }
            })
			.catch(err => document.write(err));


	}

	findUsersMonkeys(user) {
        fetch(`/monkeys/${user}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                'Authorization': [this.state.token, user]}
        })
            .then(response => response.json())
            .then(monkeys => this.setState({
                monkeys: monkeys
            })).catch(err => document.write(err));
	}

	sendPublicMonkey(monkey) {
        const connection = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws");
        connection.onopen = () => connection.send(JSON.stringify(monkey));

	}

    savePublicMonkey(oldMonkey, newMonkey) {
		let nMonkey = "";

        let newMonkeyState = this.state.monkeys.map(monkey => {
            if (monkey._id === oldMonkey.id) {
                monkey.isPublic = newMonkey.isPublic;
                nMonkey = monkey;
            }
            return monkey;
        });
        this.updatePublicMonkey(oldMonkey, nMonkey);
        this.setState(prevState => ({
            monkeys: newMonkeyState
        }));
        this.sendPublicMonkey(nMonkey);
    }

    updatePublicMonkey(monkeyToUpdate, updatedMonkey) {
        fetch(`/monkeys/public/${monkeyToUpdate.id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                'Authorization': [this.state.token, monkeyToUpdate.user]
                },
            body: JSON.stringify(updatedMonkey)
        }).catch(err => document.write(err));
    }

	findPublicMonkeys(isPublic) {
		fetch(`/monkeys/public/${isPublic}`, {
		    method: "GET",
            headers: {
                "Content-type": "application/json",
                'Authorization': [this.state.token, this.state.userEmail]}
        })
			.then(response => response.json())
			.then(monkeys => this.setState({
                inspirationMonkeys: monkeys
			})).catch(err => document.write(err));
	}

	updateMonkey(monkeyToUpdate, updatedMonkey) {
        fetch(`/monkeys/${monkeyToUpdate.id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                'Authorization': [this.state.token, monkeyToUpdate.user]
            },
			body: JSON.stringify(updatedMonkey)
        }).then(response => response.json())
            .then(json => {
                if (json.message !== undefined) {
                    alert(json.message);
                }
            }).catch(err => document.write(err));

    }


}

export default App;
