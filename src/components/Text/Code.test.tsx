import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Code from './Code';

test('renders without crashing', async () => {
    render(<Code>asdf</Code>);
});

test('renders with classes', async () => {
    render(
        <Code small large muted>
            asdf
        </Code>
    );
});
