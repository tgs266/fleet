/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-sequences */
const path = require('path');

module.exports = {
    entry: './app/main.js',
    target: 'electron-main',
    mode: 'development',
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
                test: /worker-.*\.js/,
                include: [/node_modules\/ace-build/],
                type: 'asset/resource',
            },
            {
                test: /\.(ts|tsx)$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'ts-loader',
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
        ],
    },
};
