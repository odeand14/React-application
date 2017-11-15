import React from "react";

export default class InspirationListItem extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <tbody>
            <tr>
                <td className="lead">
                    {this.props.name}
                </td>
                <td className="lead">
                    {this.props.race}
                </td>
                <td className="lead">
                    {this.props.user}
                </td>
            </tr>
            </tbody>
        )
    }

}