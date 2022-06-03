import { buildGenericLink } from './routing';

test('buildGenericLink 1', () => {
    expect(buildGenericLink('deployment', 'asdf', 'asdf').link).toContain('deployments/asdf/asdf');
});

test('buildGenericLink 2', () => {
    expect(buildGenericLink('service', 'asdf', 'asdf').link).toContain('services/asdf/asdf');
});

test('buildGenericLink 3', () => {
    expect(buildGenericLink('rolebinding', 'asdf', 'asdf').link).toContain(
        'rolebindings/asdf/asdf'
    );
});

test('buildGenericLink 4', () => {
    expect(buildGenericLink('role', 'asdf', 'asdf').link).toContain('roles/asdf/asdf');
});

test('buildGenericLink 5', () => {
    expect(buildGenericLink('serviceaccount', 'asdf', 'asdf').link).toContain(
        'serviceaccounts/asdf/asdf'
    );
});

test('buildGenericLink 6', () => {
    expect(buildGenericLink('secret', 'asdf', 'asdf').link).toContain('secrets/asdf/asdf');
});

test('buildGenericLink 7', () => {
    expect(buildGenericLink('', 'asdf', 'asdf').link).toContain('asdf');
});
