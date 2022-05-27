const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: path.resolve(__dirname, 'src', 'assets'), to: 'assets' }],
        }),
        new webpack.DefinePlugin({
            'process.env.TEST_ENV': JSON.stringify(false),
            'process.env.NODE_DEBUG': null,
        }),
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            features: ['!gotoSymbol'],
            languages: ['yaml'],
        }),
    ],
});
