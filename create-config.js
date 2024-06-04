const fs = require('fs');

const config = {
  "_comment": "Configuration settings for blockchain interaction and Turnstile widget. 'projectId' is the unique identifier for the project, 'activeNetwork' specifies the blockchain network (like 'baseMainnet' for Base Mainnet or 'baseSepolia' for Sepolia Base Testnet or 'sepolia' for Sepolia Main Testnet), 'contractAddress' is the address of the smart contract, 'webAddress' is the API endpoint for transaction counts, and 'turnstileSiteKey' is the site key for the Cloudflare Turnstile widget.",
  "projectId": process.env.PROJECT_ID,
  "activeNetwork": process.env.ACTIVE_NETWORK,
  "contractAddress": process.env.CONTRACT_ADDRESS,
  "authWebAddress": process.env.AUTH_WEB_ADDRESS,
  "turnstileSiteKey": process.env.TURNSTILE_SITE_KEY,
  "emailToken": process.env.EMAIL_TOKEN,
  "emailServiceID": process.env.EMAIL_SERVICE_ID,
  "emailTemplate": process.env.EMAIL_TEMPLATE,
  "tweetId": process.env.TWEET_ID,
  "tweetMessage": process.env.TWEET_MESSAGE,
  "userName": process.env.USER_NAME,
  "checkRetweetEnabled": process.env.CHECK_RETWEET_ENABLED,
  "checkTweetEnabled": process.env.CHECK_TWEET_ENABLED,
  "checkLikeEnabled": process.env.CHECK_LIKE_ENABLED,
  "retweetEnabled": process.env.RETWEET_ENABLED,
  "tweetEnabled": process.env.TWEET_ENABLED,
  "likeEnabled": process.env.LIKE_ENABLED,
  "followEnabled": process.env.FOLLOW_ENABLED,
};

fs.writeFileSync('contract-config.json', JSON.stringify(config, null, 2));