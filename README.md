# Lotso Coins - Leading the PvP Mode

[![Deploy static content to Pages](https://github.com/BTI-US/Lotso/actions/workflows/static.yml/badge.svg?branch=master)](https://github.com/BTI-US/Lotso/actions/workflows/static.yml)
[![CodeQL](https://github.com/BTI-US/Lotso/actions/workflows/codeql.yml/badge.svg)](https://github.com/BTI-US/Lotso/actions/workflows/codeql.yml)

- Last Modified: 2024-03-25
- Author: Saurabh Kumar

## Introduction

Lotso Coins is a decentralized application (dApp) that allows users to play PvP games and earn rewards in the form of cryptocurrencies. The dApp is built on the Ethereum blockchain and uses smart contracts to facilitate the gaming experience. Players can connect their wallets to the dApp and participate in various games to win Lotso Coins (LTC). The dApp also features a leaderboard that displays the top players based on their performance in the games. Lotso Coins aims to provide a fun and rewarding gaming experience for users while promoting the adoption of cryptocurrencies.

## Requirements

1. Install the following dependencies for WalletConnect API:

   ```bash
   npm install --save-dev @web3modal/wagmi @wagmi/core @wagmi/connectors viem
   ```

2. Install the following dependencies for Webpack:

   ```bash
   npm install --save-dev webpack webpack-cli
   ```

3. Install the following dependencies for Web3:

   ```bash
   npm install --save-dev web3
   ```

4. Install the following dependencies for Babel:

   ```bash
   npm install --save-dev @babel/core @babel/preset-env babel-loader
   ```

## How to Use Webpack to Bundle the Project

1. Create a `webpack.config.js` file in the root directory of the project.
2. Add the following code to the `webpack.config.js` file:

   ```javascript
   const path = require('path');

   module.exports = {
     entry: './src/index.js',
     output: {
       filename: 'bundle.js',
       path: path.resolve(__dirname, 'dist'),
     },
   };
   ```
3. Add the following script to the `package.json` file:

   ```json
   "scripts": {
     "build": "webpack"
   }
   ```
4. Run the following command to bundle the project:

   ```bash
   npm run build
   ```
Note: After running the command, a `dist` folder will be created in the root directory of the project, and the bundled JavaScript file `bundle.js` will be generated in the `dist` folder. Remember to perform a production build before deploying the project to GitHub Pages.

## Documentation

Click [here](https://lotso.org/documentation/index.html) to view the documentation.

## WalletConnect API Usage

Click [here](https://docs.walletconnect.com/quick-start/dapps/web3-provider) to learn more about WalletConnect API.

Click [here](https://docs.walletconnect.com/web3modal/javascript/about) to learn more about how to use the WalletConnect API for JavaScripts.

## Infura API Usage

Click [here](https://infura.io/docs) to learn more about Infura API.

## Size of Images

about1.png - 255x420

about2.png - 238x420

about3.png - 258x420

banner.png - 664x480

blog1.jpg - 310x210

blog3.jpg - 310x210

blog4.jpg - 310x210

g1.png - 760x380

g2.png - 270x400

g3.png - 201x320

g4.png - 201x320

g5.png - 821x650

pro1.png - 288x450

p1.png - 90x90

p2.png - 90x90

p3.png - 90x90

p4.png - 90x90

p5.png - 90x90

t1.png - 400x400

t2.png - 400x400

t3.png - 400x400

testimonial1.png - 90x89

testimonial2.png - 90x89

testimonial3.png - 90x89