const fs = require('fs');

const config = {
  "_comment": "Input base or baseGoerli for mainnet or goerli testnet respectively",
  "activeNetwork": process.env.ACTIVE_NETWORK,
  "contractAddress": process.env.CONTRACT_ADDRESS,
  "webAddress": process.env.WEB_ADDRESS
};

fs.writeFileSync('contract-config.json', JSON.stringify(config, null, 2));