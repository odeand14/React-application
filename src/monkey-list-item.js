import React from "react";

export default class MonkeyListItem extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            name: "",
            race: "",
            isEditing: false,
            isPublic: !this.props.isPublic
        }
    }

    render() {
        return(
            <tbody>
            {this.state.isEditing ? (
                <tr>
                    <td>
                        <input
                            type="text"
                            onChange={e => {
                                this.setState({
                                    name: e.target.value,
                                })
                            }}
                            defaultValue={this.props.name}
                            ref="editName" />
                    </td>
                    <td>
                        <input
                            type="text"
                            onChange={(e) => {
                                this.setState({
                                    race: e.target.value
                                })
                            }}
                            defaultValue={this.props.race}
                            ref="editRace" />
                    </td>
                    <td>
                        <input type="checkbox" onChange={this.onPublicClick.bind(this)} defaultChecked={this.props.isPublic}/>
                    </td>
                    <td>
                        <button className="btn btn-primary mx-1" onClick={this.onSaveClick.bind(this)}>Save</button>
                        <button className="btn btn-warning mx-1" onClick={this.onCancelClick.bind(this)}>Cancel</button>
                    </td>
                </tr>
            ) : (
                <tr>
                    <td className="lead">
                        {this.props.name}
                    </td>
                    <td className="lead">
                        {this.props.race}
                    </td>
                    <td>
                        <input type="checkbox" onChange={this.onPublicClick.bind(this)} defaultChecked={this.props.isPublic}/>
                    </td>
                    <td>
                        <button className="btn btn-primary mx-1" disabled={!this.props.isLoggedIn} onClick={this.onEditClick.bind(this)} >Edit</button>
                        <button className="btn btn-danger mx-1" disabled={!this.props.isLoggedIn} onClick={this.props.deleteMonkey.bind(this, this.props.id)}>Delete</button>
                    </td>
                </tr>
            )}
            </tbody>
        );
    }

    onPublicClick() {
        this.setState({
            isPublic: !this.state.isPublic
        });

        const oldMonkey = {
            id: this.props.id
        };
        const newMonkey = {
            isPublic: this.state.isPublic
        };
        this.props.savePublicMonkey(oldMonkey, newMonkey)

    }

    onEditClick() {
        this.setState({isEditing: true});
    }

    onCancelClick() {
        this.setState({isEditing: false});
    }

    onSaveClick(event) {
        event.preventDefault();

        const oldMonkey = {
            name: this.props.name,
            race: this.props.race,
            id: this.props.id
        };
        const newMonkey = {
            name: this.state.name,
            race: this.state.race
        };
        this.props.saveMonkey(oldMonkey, newMonkey);
        this.setState({isEditing: false});
    }

}