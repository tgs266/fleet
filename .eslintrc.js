module.exports = {
    extends: ['airbnb', 'airbnb-typescript'],
    parserOptions: {
        project: './tsconfig.json',
    },
    env: {
        browser: true,
        es2021: true,
        node: true,
        commonjs: true,
        jest: true,
    },
}
