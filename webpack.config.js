const path = require('path');

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
    }
};
