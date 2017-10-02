import React from "react";

export default class MonkeyListItem extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            name: "",
            race: "",
            isEditing: false
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
                        <button onClick={this.onSaveClick.bind(this)}>Save</button>
                        <button onClick={this.onCancelClick.bind(this)}>Cancel</button>
                    </td>
                </tr>
            ) : (
                <tr>
                    <td>
                        {this.props.name}
                    </td>
                    <td>
                        {this.props.race}
                    </td>
                    <td>
                        <button onClick={this.onEditClick.bind(this)} >Edit</button>
                        <button onClick={this.props.deleteMonkey.bind(this, this.props.id)}>Delete</button>
                    </td>
                </tr>
            )}
            </tbody>
        );
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
            race: this.props.race
        };
        const newMonkey = {
            name: this.state.name,
            race: this.state.race
        };
        this.props.saveMonkey(oldMonkey, newMonkey);
        this.setState({isEditing: false});
    }

}