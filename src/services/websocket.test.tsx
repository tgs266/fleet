import '@testing-library/jest-dom';
import { handleClose } from './websocket';

test('can handle close', async () => {
    const ce = new CloseEvent('asdf', {
        reason: 'status": "UNAUTHORIZED", "code": 401, "message": "asdf"}',
    });
    handleClose(ce);
});

test('can handle close no reason', async () => {
    const jfn = jest.fn();
    const ce = new CloseEvent('asdf', {
        reason: '',
    });
    handleClose(ce, jfn);
    expect(jfn).toHaveBeenCalled();
});
