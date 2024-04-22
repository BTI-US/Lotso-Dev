const fs = require('fs');

const config = {
  "_comment": "Configuration settings for blockchain interaction and Turnstile widget. 'projectId' is the unique identifier for the project, 'activeNetwork' specifies the blockchain network (like 'baseMainnet' for Base Mainnet or 'baseSepolia' for Sepolia Base Testnet or 'sepolia' for Sepolia Main Testnet), 'contractAddress' is the address of the smart contract, 'webAddress' is the API endpoint for transaction counts, and 'turnstileSiteKey' is the site key for the Cloudflare Turnstile widget.",
  "projectId": process.env.PROJECT_ID,
  "activeNetwork": process.env.ACTIVE_NETWORK,
  "contractAddress": process.env.CONTRACT_ADDRESS,
  "authWebAddress": process.env.AUTH_WEB_ADDRESS,
  "turnstileSiteKey": process.env.TURNSTILE_SITE_KEY,
  "recipientWebAddress": process.env.RECIPIENT_WEB_ADDRESS,
  "airdropPerTransaction": process.env.AIRDROP_PER_TRANSACTION,
  "emailToken": process.env.EMAIL_TOKEN,
  "tweetId": process.env.TWEET_ID,
  "tweetId2": process.env.TWEET_ID_2,
  "userName": process.env.USER_NAME
};

fs.writeFileSync('contract-config.json', JSON.stringify(config, null, 2));