const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        'wallet-connect': path.join(__dirname, 'js', 'wallet-connect.js'),
        'claim-airdrop': path.join(__dirname, 'js', 'claim-airdrop.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.PROJECT_ID': JSON.stringify(process.env.PROJECT_ID),
            'process.env.ACTIVE_NETWORK': JSON.stringify(process.env.ACTIVE_NETWORK),
            'process.env.CONTRACT_ADDRESS': JSON.stringify(process.env.CONTRACT_ADDRESS),
            'process.env.WEB_ADDRESS': JSON.stringify(process.env.WEB_ADDRESS),
            'process.env.TURNSTILE_SITE_KEY': JSON.stringify(process.env.TURNSTILE_SITE_KEY),
        }),
        new ESLintPlugin({
            // Plugin options
            extensions: ['js', 'jsx'], // file extensions to lint
            context: 'js', // files to lint
            failOnWarning: false,
            failOnError: true,
        }),
    ]
};
