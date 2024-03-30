const fs = require('fs');

const config = {
  "_comment": "Input base or baseGoerli for mainnet or goerli testnet respectively",
  "projectId": process.env.PROJECT_ID,
  "activeNetwork": process.env.ACTIVE_NETWORK,
  "contractAddress": process.env.CONTRACT_ADDRESS,
  "webAddress": process.env.WEB_ADDRESS,
  "turnstileSiteKey": process.env.TURNSTILE_SITE_KEY
};

fs.writeFileSync('contract-config.json', JSON.stringify(config, null, 2));