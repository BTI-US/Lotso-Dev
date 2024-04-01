const fs = require('fs');

const config = {
  "_comment": "Configuration settings for blockchain interaction and Turnstile widget. 'projectId' is the unique identifier for the project, 'activeNetwork' specifies the blockchain network (like 'baseMainnet' for Base Mainnet or 'baseSepolia' for Sepolia Base Testnet or 'sepolia' for Sepolia Main Testnet), 'contractAddress' is the address of the smart contract, 'webAddress' is the API endpoint for transaction counts, and 'turnstileSiteKey' is the site key for the Cloudflare Turnstile widget.",
  "projectId": process.env.PROJECT_ID,
  "activeNetwork": process.env.ACTIVE_NETWORK,
  "contractAddress": process.env.CONTRACT_ADDRESS,
  "webAddress": process.env.WEB_ADDRESS,
  "turnstileSiteKey": process.env.TURNSTILE_SITE_KEY,
};

fs.writeFileSync('contract-config.json', JSON.stringify(config, null, 2));