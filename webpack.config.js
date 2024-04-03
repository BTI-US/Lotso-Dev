const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        'airdrop-update': path.join(__dirname, 'js', 'airdrop-update.js'),
        'claim-airdrop': path.join(__dirname, 'js', 'claim-airdrop.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    resolve: {
        alias: {
            'stream': 'stream-browserify',
            'assert': 'assert'
        }
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
            'process.env.ETHERSCAN_API_KEY': JSON.stringify(process.env.ETHERSCAN_API_KEY),
            'process.env.MAIN_CONTRACT_ADDRESS': JSON.stringify(process.env.MAIN_CONTRACT_ADDRESS),
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
