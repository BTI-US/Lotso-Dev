const path = require('path');

module.exports = {
    mode: "development",
    entry: path.join(__dirname, 'js', 'wallet-connect.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
}