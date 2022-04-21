import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconSwapButton from './IconSwapButton';

test('renders without crashing', async () => {
    render(<IconSwapButton btnProps={{ text: 'asdf', icon: 'minus' }} otherIcon="add" />);
});

test('swap', async () => {
    const wrapper = render(
        <IconSwapButton
            btnProps={{ text: 'asdf', icon: 'minus', onClick: () => {} }}
            otherIcon="add"
        />
    );
    fireEvent.click(wrapper.getByTestId('btn-swap-icon'));
    fireEvent.click(wrapper.getByTestId('btn-swap-icon'));
    const wrapper2 = render(
        <IconSwapButton
            btnProps={{ text: 'asdf', icon: 'minus', onClick: () => {} }}
            otherIcon="add"
        />
    );
    expect(wrapper.getAllByTestId('btn-swap-icon')[0]).toStrictEqual(
        wrapper2.getAllByTestId('btn-swap-icon')[1]
    );
});
