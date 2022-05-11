import urlJoin from './urljoin';

test('urlJoin 1', () => {
    urlJoin(['asdf', 'ghkj']);
});

test('urlJoin 2', () => {
    urlJoin('');
});

test('urlJoin 3', () => {
    urlJoin('asdf', '/asdf', '//');
});

test('urlJoin 4', () => {
    try {
        urlJoin(2, '/asdf', '//');
    } catch {
        console.log('caught');
    }
});

test('urlJoin 5', () => {
    try {
        urlJoin();
    } catch {
        console.log('caught');
    }
});

test('urlJoin 6', () => {
    urlJoin('https://', 'asdf');
});

test('urlJoin 7', () => {
    urlJoin('https:/asdfsadf:345', 'asdf');
});

test('urlJoin 8', () => {
    urlJoin('file:///asdfsadf:345', 'asdf');
});
