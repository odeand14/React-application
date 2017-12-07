import React from 'react';
import Header from '../header';
import renderer from 'react-test-renderer';

it('renders a snapshot', () => {
    const tree = renderer
        .create(<Header/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

