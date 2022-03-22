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
        '@typescript-eslint/indent': ['error', 4],
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
    },
    env: {
        browser: true,
        es2021: true,
        node: true,
        commonjs: true,
        jest: true,
    },
};
