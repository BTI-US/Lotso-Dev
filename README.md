# Lotso Coins - Leading the PvP Mode

[![Deploy static content to Pages](https://github.com/BTI-US/Lotso/actions/workflows/static.yml/badge.svg?branch=master)](https://github.com/BTI-US/Lotso/actions/workflows/static.yml)
[![CodeQL](https://github.com/BTI-US/Lotso/actions/workflows/codeql.yml/badge.svg)](https://github.com/BTI-US/Lotso/actions/workflows/codeql.yml)
[![Deploy Worker to Cloudflare](https://github.com/BTI-US/Lotso/actions/workflows/worker.yml/badge.svg)](https://github.com/BTI-US/Lotso/actions/workflows/worker.yml)

- Last Modified: 2024-03-31
- Author: Saurabh Kumar

## Introduction

Lotso Coins is a decentralized platform for non-fungible tokens (NFTs), where users can buy, sell, and trade unique digital assets. Our platform operates on the **Base** blockchain, utilizing its capabilities to ensure secure ownership and provenance of NFTs through smart contracts. Users have the opportunity to connect their digital wallets to the platform, exploring a diverse collection of NFTs across various categories such as art, collectibles, and virtual real estate. Additionally, Lotso Coins provides a marketplace for creators to showcase and monetize their digital creations. By embracing the world of NFTs, Lotso Coins aims to empower artists, collectors, and enthusiasts, fostering creativity and innovation in the digital realm.

**Co-Branding with Disney**: We are proud to announce our collaboration with Disney, bringing beloved characters and iconic moments to the world of NFTs. Stay tuned for exclusive Disney-themed NFT collections and experiences on Lotso Coins!

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

Click [here](https://infura.io/docs/gettingStarted/chooseaNetwork) to choose a network for Infura API.

## Network for Our Blockchain

We are using the Base Mainnet network for our blockchain.

Click [here](https://docs.base.org/network-information/) to learn more about the Base Mainnet network.

We use viem library to define the Base network in our project.

### Blockchain Information for Base Network

|Name|Value|
|-|-|
|Network Name|Base Mainnet|
|Description|The public mainnet for Base.|
|RPC Endpoint|https://mainnet.base.org|
|Chain ID|8453|
|Currency Symbol|ETH|
|Block Explorer|https://basescan.org|

Refer to the [Base Network](https://github.com/wevm/viem/blob/main/src/chains/definitions/base.ts) for the definition of the Base Mainnet network in viem.

### Blockchain Information for Base Sepolia Network

|Name|Value|
|-|-|
|Network Name|Base Sepolia Testnet|
|Description|The public testnet for Base.|
|RPC Endpoint|https://sepolia.base.org|
|Chain ID|84531|
|Currency Symbol|ETH|
|Block Explorer|https://sepolia.basescan.org|

Refer to the [Base Sepolia Network](https://github.com/wevm/viem/blob/main/src/chains/definitions/baseSepolia.ts) for the definition of the Base Mainnet network in viem.

### Supported Blockchain

Click [here](https://github.com/WalletConnect/blockchain-api/blob/master/SUPPORTED_CHAINS.md) to view the supported blockchain for WalletConnect.

## JSON Protocol

### Body Parameters

```json
{
    "code": 0,
    "message": "Success",
    "error": "",
    "data": {
        "address": "0xbA6a68677e0A16dcB1ff4BDDF613563133201280",
        "transaction_count": 8552,
        "airdrop_count": 100000000000000000000000,
        "has_airdropped": false,
        "scheduled_delivery": "2024-03-31T11:00:00Z"
    }
}
```

### Description

| Field              | Type    | Description                                                                                      |
|--------------------|---------|--------------------------------------------------------------------------------------------------|
| `code`             | Integer | The status code of the response. `0` indicates a successful response.                             |
| `message`          | String  | The status message associated with the response. `Success` indicates a successful operation.      |
| `error`            | String  | Contains error message if any error occurs, otherwise empty.                                      |
| `data`             | Object  | A container for the data payload of the response.                                                 |
| `data.address`     | String  | The blockchain address associated with the query.                                                 |
| `data.transaction_count` | Integer | The number of transactions associated with the address.                                     |
| `data.airdrop_count`| Integer | The airdrop count for the address, which is either `0` or `100000000000000000000000` (100000 * 10^18).                           |
| `data.has_airdropped` | Boolean | Indicates if the airdrop has occurred. `false` means airdrop has not started; `true` means airdrop has occurred, and the user cannot claim it again if already claimed. |
| `data.scheduled_delivery` | String | The next available time for claiming the airdrop. If it cannot be claimed (transaction_count <= 10), it will be set to 1970-01-01T08:00:00Z in UTC+0 timezone. |

## Setting Up `contract-config.json` for Local Deployment

To successfully deploy and run the project locally, you need to create a `contract-config.json` file in the root directory of the project. This file contains essential configuration details needed for the application to interact with the blockchain network.

### Step-by-Step Guide

1. **Create the File:**
   - In the root directory of your project, create a file named `contract-config.json`.

2. **Add Basic Structure:**
   - Open the file in a text editor and add the following JSON structure:
     ```json
     {
         "_comment": "Configuration settings for blockchain interaction and Turnstile widget. 'projectId' is the unique identifier for the project, 'activeNetwork' specifies the blockchain network (like 'baseMainnet' for Base Mainnet or 'baseSepolia' for Sepolia Base Testnet or 'sepolia' for Sepolia Main Testnet), 'contractAddress' is the address of the smart contract, 'webAddress' is the API endpoint for transaction counts, and 'turnstileSiteKey' is the site key for the Cloudflare Turnstile widget.",
         "activeNetwork": "Your_Network_Choice",
         "contractAddress": "Your_Contract_Address",
         "webAddress": "Your_Web_Address",
         "turnstileSiteKey": "Your_CloudFlare_Turnstile_Site_Key",
         "etherscanApiKey": "Your_Infura_API_Key"
     }
     ```
   - Replace `Your_Network_Choice` with the network you are using (e.g., `base` for the Base Mainnet).
   - Replace `Your_Contract_Address` with the actual contract address you are using.
   - Replace `Your_Web_Address` with the web address for airdrop eligibility check.
   - Replace `Your_CloudFlare_Turnstile_Site_Key` with the site key for the Cloudflare Turnstile widget.

3. **Save the File:**
   - Save your changes to `contract-config.json`.

4. **Important Notes:**
   - The `contract-config.json` file is crucial for the application's interaction with the blockchain. Ensure that the details are correct.
   - If you are working in a team or planning to push this code to a public repository, **do not** include sensitive information like private keys or secret tokens in the `contract-config.json` file. Instead, use environment variables or other secure methods to handle sensitive data.

5. **.gitignore:**
   - If you are using Git, make sure to add `contract-config.json` to your `.gitignore` file to prevent accidentally pushing it to a public repository:
     ```bash
     echo "contract-config.json" >> .gitignore
     ```

### Example File

Here is an example of what your `contract-config.json` might look like for the Base Mainnet:

```json
{
    "_comment": "Configuration settings for blockchain interaction and Turnstile widget. 'projectId' is the unique identifier for the project, 'activeNetwork' specifies the blockchain network (like 'baseMainnet' for Base Mainnet or 'baseSepolia' for Sepolia Base Testnet or 'sepolia' for Sepolia Main Testnet), 'contractAddress' is the address of the smart contract, 'webAddress' is the API endpoint for transaction counts, and 'turnstileSiteKey' is the site key for the Cloudflare Turnstile widget.",
    "projectId": "0x123abc456def789ghi",
    "activeNetwork": "baseMainnet",
    "contractAddress": "0x123abc456def789ghi",
    "webAddress": "https://flxdu.cn:8011/v1/info/transaction_count",
    "turnstileSiteKey": "0x123abc456def789ghi",
    "etherscanApiKey": "0x123abc456def789ghi"
}
```

Once you have created and configured your `contract-config.json` file, you can proceed with the local deployment of the application.

## Cloud Deployment on GitHub Pages and Cloudflare Pages

This section provides guidance on deploying your project to GitHub Pages and Cloudflare Pages, with specific instructions on setting up required environment variables for each platform.

### Required Environment Variables

1. Used for Website:

   |Env Name|Ignorable|Description|
   |-|-|-|
   |**`ACTIVE_NETWORK`**|Essential|Specifies the blockchain network the application should connect to (e.g., baseMainnet, baseSepolia, sepolia).|
   |**`CLOUDFLARE_ENV`** (Set to `true` for cloud building)|Essential|Indicates if the build process is running in a cloud environment, often used for specific configurations or optimizations for automated CI for cloud hosting.|
   |**`CONTRACT_ADDRESS`**|Essential|The Ethereum smart contract address the web application interacts with.|
   |**`PROJECT_ID`**|Essential|A unique identifier obtained from WalletConnect, used for WalletConnect API calls.|
   |**`TURNSTILE_SITE_KEY`**|Essential|The site key for Cloudflare's Turnstile service, used for bot protection and CAPTCHA verification.|
   |**`WEB_ADDRESS`**|Essential|The backend URL of the airdrop function, better to use the specified domain for the project for clearer identification.|
   |**ETHERSCAN_API_KEY**|Essential|The API key for Etherscan, used to interact with the Ethereum network.|
   |**MAIN_CONTRACT_ADDRESS**|Essential|The main contract of the $Lotso NFT|

2. Used for Reverse Proxy

   |Env Name|Ignorable|Description|
   |-|-|-|
   |**`CLOUDFLARE_ACCOUNT_ID`**|Essential|The account ID for Cloudflare, used to authenticate and manage resources via Cloudflare APIs.|
   |**`CLOUDFLARE_API_TOKEN`**|Essential|A token used to authenticate API requests to Cloudflare, allowing to interact with Cloudflare worker services.|
   |**`CLOUDFLARE_WORKER_NAME`**|Optional|The name of a Cloudflare Worker, if used, which can execute serverless code at the edge for tasks like routing or custom caching, "api" by default|
   |**`SERVER_HTTP_PORT`**|Optional|The port number on which the reverse proxy server listens for HTTP traffic, "8080" by default|

### Setting Environment Variables in GitHub

1. Go to your repository on GitHub.
2. Navigate to "Settings" > "Secrets".
3. Click on "New repository secret" and add each environment variable:
   - Name: Variable name (e.g., `PROJECT_ID`).
   - Value: Corresponding value for the variable.
4. Repeat this process for `ACTIVE_NETWORK`, `CONTRACT_ADDRESS`, `WEB_ADDRESS` and `TURNSTILE_SITE_KEY` and others.

### Deploying to GitHub Pages

- Your project should be configured for deployment via GitHub Actions.
- Push a commit to trigger the GitHub Actions workflow, utilizing the set environment variables.

### Setting Environment Variables in Cloudflare Pages

1. Log into your Cloudflare account and access the Pages dashboard.
2. Select your project and go to "Settings" > "Environment variables" (under "Build & deploy").
3. Add each variable by specifying its Name and Value.
4. Particularly, ensure `CLOUDFLARE_ENV` is set to `true`.

### Deploying to Cloudflare Pages

- Cloudflare Pages automatically builds and deploys upon repository updates.
- Ensure your repository is linked to Cloudflare Pages with correct build commands.
- The environment variables will be utilized during Cloudflare's build process.

### Important Notes

- Keep sensitive data such as API keys secure and prevent unnecessary exposure.
- For local development, replicate the environment variable setup to test the application effectively.
- Document any unique build steps or configurations specific to your project.

## Size of Images

Replaced Image Sizes:

- about1.png - 255x420
- about2.png - 238x420
- about3.png - 258x420
- banner.png - 664x480
- blog1.jpg - 310x210
- blog3.jpg - 310x210
- blog4.jpg - 310x210
- g1.png - 760x380
- g2.png - 270x400
- g3.png - 201x320
- g4.png - 201x320
- g5.png - 821x650
- pro1.png - 288x450
- p1.png - 90x90
- p2.png - 90x90
- p3.png - 90x90
- p4.png - 90x90
- p5.png - 90x90
- t1.png - 400x400
- t2.png - 400x400
- t3.png - 400x400
- testimonial1.png - 90x89
- testimonial2.png - 90x89
- testimonial3.png - 90x89
- blog1.jpg - 620x420