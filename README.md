# Lotso Coins - Leading the PvP Mode

[![Deploy static content to Pages](https://github.com/BTI-US/Lotso/actions/workflows/static.yml/badge.svg?branch=master)](https://github.com/BTI-US/Lotso/actions/workflows/static.yml)
[![CodeQL](https://github.com/BTI-US/Lotso/actions/workflows/codeql.yml/badge.svg)](https://github.com/BTI-US/Lotso/actions/workflows/codeql.yml)
[![Deploy Worker to Cloudflare](https://github.com/BTI-US/Lotso/actions/workflows/worker.yml/badge.svg)](https://github.com/BTI-US/Lotso/actions/workflows/worker.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- Last Modified: 2024-04-22
- Author: Phill Weston

## Table of Contents

- [Lotso Coins - Leading the PvP Mode](#lotso-coins---leading-the-pvp-mode)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Requirements](#requirements)
  - [How to Use Webpack to Bundle the Project](#how-to-use-webpack-to-bundle-the-project)
  - [How to Obtain the Airdrop](#how-to-obtain-the-airdrop)
  - [WalletConnect API Usage](#walletconnect-api-usage)
  - [Infura API Usage](#infura-api-usage)
  - [Network for Our Blockchain](#network-for-our-blockchain)
    - [Blockchain Information for Base Network](#blockchain-information-for-base-network)
    - [Blockchain Information for Base Sepolia Network](#blockchain-information-for-base-sepolia-network)
    - [Supported Blockchain](#supported-blockchain)
  - [Setting Up for Mail Subscription Service](#setting-up-for-mail-subscription-service)
  - [Setting Up `contract-config.json` for Local Deployment](#setting-up-contract-configjson-for-local-deployment)
    - [Step-by-Step Guide](#step-by-step-guide)
    - [Example File](#example-file)
  - [Cloud Deployment on GitHub Pages and Cloudflare Pages](#cloud-deployment-on-github-pages-and-cloudflare-pages)
    - [Required Environment Variables](#required-environment-variables)
    - [Setting Environment Variables in GitHub](#setting-environment-variables-in-github)
    - [Deploying to GitHub Pages](#deploying-to-github-pages)
    - [Setting Environment Variables in Cloudflare Pages](#setting-environment-variables-in-cloudflare-pages)
    - [Setting Custom Domains in Cloudflare Workers](#setting-custom-domains-in-cloudflare-workers)
    - [Deploying to Cloudflare Pages](#deploying-to-cloudflare-pages)
    - [Important Notes](#important-notes)
  - [Size of Images](#size-of-images)
  - [License](#license)

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

## How to Obtain the Airdrop

Click [here](https://lotso.org/documentation/index.html) to view the detailed documentation on how to obtain the airdrop.

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

## Setting Up for Mail Subscription Service

Here is the detailed step about how to configure the backend mail server for GitHub Pages (or other web services that only support frontend pages).

1. Generate HTML Mail Template (Postcards)
    
    [Postcards - Designmodo](https://designmodo.com/postcards/app/)
    
    After editing the contents, export as a ZIP file with the images and HTML files together.
    
2. Domain Email Account Registration and SMTP Server Setting
    
    [GoDaddy Webmail](https://email.godaddy.com/)
    
3. Use EmailJS for Email Backend Service
    
    Basic Setting
    
    [Send email directly from your code | EmailJS](https://www.emailjs.com/)
    
    REST API Documentation
    
    [/send API | EmailJS](https://www.emailjs.com/docs/rest-api/send/)
    
    Note: 
    
    - SMTP.js only supports elasticemail as its backend SMTP mail server, no third-party SMTP server is supported.
    - The limitation of the content body of EmailJS is no more than 50kb, be sure the size of the HTML file is less than the threshold.
    - We can use the following website to shrink the size of the HTML file by removing the unnecessary characters (like white space, etc)
        
        [HTML Compressor - Reduce the size of HTML, CSS, JavaScript, PHP and Smarty code.](https://htmlcompressor.com/compressor/)
        
4. Backblaze B2 OBS Bucket for Image Storage
    
    We need to upload the images extracted from the downloaded ZIP file to the OBS bucket and replace all of the image paths from the relative path to the HTTPS path, which can be obtained through the detailed property of the file in the OBS bucket.

## Setting Up `contract-config.json` for Local Deployment

To successfully deploy and run the project locally, you need to create a `contract-config.json` file in the root directory of the project. This file contains essential configuration details needed for the application to interact with the blockchain network.

### Step-by-Step Guide

1. **Create the File:**
   - In the root directory of your project, create a file named `contract-config.json`.

2. **Add Basic Structure:**
   - Open the file in a text editor and add the following JSON structure:
     ```json
     {
         "_comment": "Configuration settings for blockchain interaction and Turnstile widget. 'projectId' is the unique identifier for the project, 'activeNetwork' specifies the blockchain network (like 'baseMainnet' for Base Mainnet or 'baseSepolia' for Sepolia Base Testnet or 'sepolia' for Sepolia Main Testnet), 'contractAddress' is the address of the smart contract, 'authWebAddress' is the API endpoint for backend authentication server, and 'turnstileSiteKey' is the site key for the Cloudflare Turnstile widget.",
         "activeNetwork": "Your_Network_Choice",
         "contractAddress": "Your_Contract_Address",
         "airdropPerTransaction": "Your_Airdrop_Per_Transaction",
         "authWebAddress": "Your_Web_Address",
         "turnstileSiteKey": "Your_CloudFlare_Turnstile_Site_Key",
         "emailToken": "Your_Email_Token",
         "emailServiceID": "Your_Email_Service_ID",
         "emailTemplate": "Your_Email_Template",
         "tweetId": "Your_Tweet_Id",
         "tweetId2": "Your_Second_Tweet_Id",
         "userName": "Your_User_Name"
     }
     ```
   - Replace `Your_Network_Choice` with the network you are using (e.g., `base` for the Base Mainnet).
   - Replace `Your_Contract_Address` with the actual contract address you are using.
   - Replace `Your_Airdrop_Per_Transaction` with the actual value of the airdrop per transaction.
   - Replace `Your_Web_Address` with the web address for airdrop eligibility check.
   - Replace `Your_CloudFlare_Turnstile_Site_Key` with the site key for the Cloudflare Turnstile widget.
   - Replace `Your_Email_Token` with the token for sending emails.
   - Replace `Your_Email_Service_ID` with the service ID for sending emails, for example: `lotso_email`.
   - Replace `Your_Email_Template` with the email template name, for example: `lotso_email_template`.
   - Replace `Your_Tweet_Id` with the tweet ID for the target tweet.
   - Replace `Your_Second_Tweet_Id` with the second tweet ID for the target tweet.
   - Replace `Your_User_Name` with the user ID for the target user.

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
    "_comment": "Configuration settings for blockchain interaction and Turnstile widget. 'projectId' is the unique identifier for the project, 'activeNetwork' specifies the blockchain network (like 'baseMainnet' for Base Mainnet or 'baseSepolia' for Sepolia Base Testnet or 'sepolia' for Sepolia Main Testnet), 'contractAddress' is the address of the smart contract, 'authWebAddress' is the API endpoint for backend authentication server, and 'turnstileSiteKey' is the site key for the Cloudflare Turnstile widget.",
    "projectId": "0x123abc456def789ghi",
    "activeNetwork": "baseMainnet",
    "contractAddress": "0x123abc456def789ghi",
    "airdropPerTransaction": "100000",
    "authWebAddress": "https://api.btiplatform.com",
    "turnstileSiteKey": "0x123abc456def789ghi",
    "emailToken": "0x123abc456def789ghi",
    "emailServiceID": "lotso_email",
    "emailTemplate": "lotso_email_template",
    "tweetId": "0x123abc456def789ghi",
    "tweetId2": "0x123abc456def789ghi",
    "userName": "0x123abc456def789ghi"
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
   |**`AUTH_WEB_ADDRESS`**|Essential|The backend URL of the authentication function, used for verifying user credentials.|
   |**`AIRDROP_PER_TRANSACTION`**|Essential|The amount of airdrop per transaction, usually in the form of a string (e.g., "100000").|
   |**`EMAIL_TOKEN`**|Essential|The token for sending emails|
   |**`EMAIL_SERVICE_ID`**|Essential|The service ID for sending emails|
   |**`EMAIL_TEMPLATE`**|Essential|The email template name|
   |**`TWEET_ID`**|Essential|The tweet ID for the target tweet|
   |**`TWEET_ID2`**|Essential|The second tweet ID for the target tweet|
   |**`USER_NAME`**|Essential|The user name for the target user|
   |**`CHECK_RETWEET_ENABLED`**|Optional|Indicates if the retweet check is enabled, "false" by default|
   |**`CHECK_RETWEET_2_ENABLED`**|Optional|Indicates if the retweet check is enabled, "false" by default|
   |**`CHECK_LIKE_ENABLED`**|Optional|Indicates if the like check is enabled, "true" by default|
   |**`CHECK_FOLLOW_ENABLED`**|Optional|Indicates if the follow check is enabled, "true" by default|
   |**`RETWEET_ENABLED`**|Optional|Indicates if the retweet is enabled, "false" by default|
   |**`RETWEET_2_ENABLED`**|Optional|Indicates if the retweet is enabled, "false" by default|
   |**`LIKE_ENABLED`**|Optional|Indicates if the like is enabled, "true" by default|
   |**`FOLLOW_ENABLED`**|Optional|Indicates if the follow is enabled, "true" by default|

2. Used for Reverse Proxy

   |Env Name|Ignorable|Description|
   |-|-|-|
   |**`CLOUDFLARE_ACCOUNT_ID`**|Essential|The account ID for Cloudflare, used to authenticate and manage resources via Cloudflare APIs.|
   |**`CLOUDFLARE_API_TOKEN`**|Essential|A token used to authenticate API requests to Cloudflare, allowing to interact with Cloudflare worker services.|
   |**`CLOUDFLARE_WORKER_NAME`**|Optional|The name of a Cloudflare Worker, if used, which can execute serverless code at the edge for tasks like routing or custom caching, "api" by default|
   |**`AIRDROP_SERVER_HTTP_PORT`**|Essential|The port number on which the reverse proxy server listens for HTTP traffic of production website, "8080" by default|
   |**`AIRDROP_SERVER_HTTP_PORT2`**|Essential|The second port number on which the reverse proxy server listens for HTTP traffic of test website, "8081" by default|
   |**`TWITTER_SERVER_HTTP_PORT`**|Essential|The port number on which the reverse proxy server listens for HTTP traffic of Twitter server, "5000" by default|
   |**`TWITTER_SERVER_HTTP_PORT2`**|Essential|The second port number on which the reverse proxy server listens for HTTP traffic of Twitter server, "5001" by default|
   |**`GANACHE_HTTP_PORT`**|Essential|The port number on which the reverse proxy server listens for HTTP traffic of Ganache server, "8546" by default|

### Setting Environment Variables in GitHub

1. Go to your repository on GitHub.
2. Navigate to "Settings" > "Secrets".
3. Click on "New repository secret" and add each environment variable:
   - Name: Variable name (e.g., `PROJECT_ID`).
   - Value: Corresponding value for the variable.
4. Repeat this process for `ACTIVE_NETWORK`, `CONTRACT_ADDRESS`, `AUTH_WEB_ADDRESS`, `TURNSTILE_SITE_KEY` and others.

### Deploying to GitHub Pages

- Your project should be configured for deployment via GitHub Actions.
- Push a commit to trigger the GitHub Actions workflow, utilizing the set environment variables.

### Setting Environment Variables in Cloudflare Pages

1. Log into your Cloudflare account and access the Pages dashboard.
2. Select your project and go to "Settings" > "Environment variables" (under "Build & deploy").
3. Add each variable by specifying its Name and Value.
4. Particularly, ensure `CLOUDFLARE_ENV` is set to `true`.

### Setting Custom Domains in Cloudflare Workers

1. Go to your Cloudflare account and access the Workers dashboard.
2. Select your worker (by default the worker name is set to 'api') and go to "Settings" > "Triggers".
3. Add the following custom domains for the worker to route traffic accordingly.
   - `api.btiplatform.com`
   - `api-dev.btiplatform.com`

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

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.