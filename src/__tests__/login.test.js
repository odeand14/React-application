import React from 'react';
import Login from '../login';
import renderer from 'react-test-renderer';

it('renders a snapshot', () => {
    const tree = renderer
        .create(<Login/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

