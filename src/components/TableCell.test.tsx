import * as React from 'react';
import { Alignment } from '@blueprintjs/core';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableCell from './TableCell';

test('renders without crashing left', async () => {
    render(<TableCell alignment={Alignment.LEFT} />);
});

test('renders without crashing right', async () => {
    render(<TableCell alignment={Alignment.RIGHT} />);
});

test('renders without crashing center', async () => {
    render(<TableCell alignment={Alignment.CENTER} />);
});
