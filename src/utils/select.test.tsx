import highlightText from './select';

it('can highlight text', () => {
    const t = 'this is a test';
    const q = 's is';

    highlightText(t, q);
});
