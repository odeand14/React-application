import React from "react";

export default class MonkeyListItem extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isEditing: false
        }
    }

    renderMonkeySection() {
        if (this.state.isEditing) {
            return(
                <tr>
                    <td>
                        <form onSubmit={this.onSaveClick.bind(this)}>
                            <input type="text" defaultValue={this.props.name} ref="editName" />
                            <input type="text" defaultValue={this.props.race} ref="editRace" />
                        </form>
                    </td>
                </tr>
            )
        }

        return(
            <tr>
                <td>
                    {this.props.name}
                </td>
                <td>
                    {this.props.race}
                </td>
            </tr>
        )
    }

    renderActionSection() {
        if (this.state.isEditing) {
            return (
                <tr>
                    <td>
                        <button onClick={this.onSaveClick.bind(this)}>Save</button>
                        <button onClick={this.onCancelClick.bind(this)}>Cancel</button>
                    </td>
                </tr>
            );
        }
        return (
            <tr>
                <td>            
                    <button onClick={this.onEditClick.bind(this)} >Edit</button>
                    <button onClick={this.props.deleteMonkey.bind(this, this.props._id)}>Delete</button>
                </td>
            </tr>
        );

    }

    render() {
        return(
            <tbody>
                {this.renderMonkeySection()}
                {this.renderActionSection()}
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

        const oldMonkey = this.props.monkey;
        const newMonkey = [this.refs.editName, this.refs.editRace];
        this.props.saveMonkey(oldMonkey, newMonkey);
        this.setState({isEditing: false});
    }

}