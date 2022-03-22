const path = require('path')

module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
        commonjs: true,
        jest: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    extends: ['plugin:react/recommended', 'eslint:recommended', 'plugin:react/jsx-runtime'],
    plugins: ['react', 'import', '@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        project: path.join(__dirname, 'tsconfig.json'),
    },
    rules: {
        'prefer-template': 'error',
        'prefer-const': [
            'error',
            {
                destructuring: 'any',
                ignoreReadBeforeAssign: false,
            },
        ],
        'no-console': 'warn',
        'import/first': 'error',
        'import/newline-after-import': 1,
        eqeqeq: 'error',

        // REACT
        'react/prop-types': 'off',
        'react/jsx-uses-react': 'error',
        'react/no-unescaped-entities': 'off',
        'react/jsx-uses-vars': 'error',
    },
}
