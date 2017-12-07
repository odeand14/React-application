import React from 'react';
import Login from '../login';
import renderer from 'react-test-renderer';

describe('Login', () => {
    it('should be able show login page', () => {
        expect(1 + 2).toEqual(3);
    });

    it('renders without crashing', () => {
        const div = renderer
            .create()
    });
});