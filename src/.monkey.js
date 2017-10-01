import React from "react";

const Monkey = (props) => (

    <tr>
        <th>#</th>
        <td>
            {props.monkey.name}
        </td>
        <td>
            {props.monkey.race}
        </td>
        <td>
            {props.monkey.date}
        </td>
        <td>
            <button>Delete</button>
        </td>
    </tr>

);

export default Monkey