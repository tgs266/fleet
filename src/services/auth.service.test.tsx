import Auth from './auth.service';

test('can run cani', () => {
    Auth.canI('asdf', 'asdf');
});
