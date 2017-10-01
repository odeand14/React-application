import React from "react";

export default class MonkeyListHeader extends React.Component {
    render() {
        return(
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Race</th>
                    <th>Action</th>
                </tr>
            </thead>
        );
    }
}