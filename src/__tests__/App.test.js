import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import renderer from 'react-test-renderer';
jest.mock('react-dom');

describe('App', () => {
    it('should be able to run tests', () => {
        expect(1 + 2).toEqual(3);
    });

    it('renders without crashing', () => {
        const div = renderer
            .create();
        ReactDOM.render(<App/>, div);
    });


});
