import React from "react";

export default class InspirationListHeader extends React.Component {
    render() {
        return(
            <thead>
            <tr className="lead">
                <th>Name</th>
                <th>Race</th>
                <th>User</th>
            </tr>
            </thead>
        );
    }
}