const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');

const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');
const BPJS_DIR = path.resolve(__dirname, './node_modules/@blueprintjs');

module.exports = {
    entry: './src/index.tsx',
    target: 'web',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        fallback: {
            util: require.resolve('util/'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
        },
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
                test: /\.(ts|tsx)$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'ts-loader',
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
                test: /\.css$/,
                include: MONACO_DIR,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.css$/,
                include: BPJS_DIR,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.css$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.(s(a|c)ss)$/,
                include: path.resolve(__dirname, 'src', 'styles'),
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.less$/,
                include: path.resolve(__dirname, 'src', 'styles'),
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            lessOptions: {
                                math: 'always',
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: path.resolve(__dirname, 'src', 'assets'), to: 'assets' }],
        }),
        new webpack.DefinePlugin({
            'process.env.TEST_ENV': JSON.stringify(false),
            'process.env.NODE_DEBUG': null, // for util
        }),
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            features: ['!gotoSymbol'],
            languages: ['yaml'],
        }),
    ],
};
