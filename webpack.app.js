/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-sequences */
const path = require('path');

module.exports = {
    entry: './app/main.js',
    target: 'electron-main',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    devServer: {
        static: './build',
    },
    watchOptions: {
        poll: true,
        ignored: /node_modules/,
    },
    module: {
        rules: [
            {
                include: [path.resolve(__dirname, 'app')],
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
        ],
    },
};
