module.exports = {
    extends: ['airbnb', 'airbnb-typescript', 'prettier'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        // override some airbnb stuff
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        '@typescript-eslint/indent': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',

        'react/jsx-props-no-spreading': 'off',
        'react/require-default-props': 'off',
        'react/no-access-state-in-setstate': 'off',
        'react/destructuring-assignment': 'off',
    },
    env: {
        browser: true,
        es2021: true,
        node: true,
        commonjs: true,
        jest: true,
    },
};
