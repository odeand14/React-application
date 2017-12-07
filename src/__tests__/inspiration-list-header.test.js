import React from 'react';
import Item from '../inspiration-header';
import renderer from 'react-test-renderer';

it('renders a snapshot', () => {
    const tree = renderer
        .create(<Item/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

