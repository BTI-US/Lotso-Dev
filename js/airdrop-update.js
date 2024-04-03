import axios from 'axios';
import { keccak256 } from 'ethereumjs-util';
import { Buffer } from 'buffer';

// Function to add commas for formatting
function addCommasToBigInt(bigIntStr) {
    let result = '';
    let length = bigIntStr.length;
    let counter = 0;

    for (let i = length - 1; i >= 0; i--) {
        counter++;
        result = bigIntStr.charAt(i) + result;
        if (counter % 3 === 0 && i !== 0) {
            result = ',' + result;
        }
    }
    return result;
}

document.addEventListener('DOMContentLoaded', function() {
    let API_KEY, CONTRACT_ADDRESS;
    
    try {
        // Attempt to load the configuration file
        const jsonConfig = require('../contract-config.json');
    
        // Access properties
        API_KEY = jsonConfig.etherscanApiKey;
        CONTRACT_ADDRESS = jsonConfig.contractAddress;
    
        // Additional validation can be performed here as needed
        if (!API_KEY || !CONTRACT_ADDRESS) {
            throw new Error("Required configuration values (API_KEY or CONTRACT_ADDRESS) are missing.");
        }
    
    } catch (error) {
        // Check if the error is due to missing file
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error("Error: Configuration file not found.");
            process.exit(1);
        }
    
        // Handle other errors
        console.error("Error loading configuration: ", error.message);
    }
    
    // Compute the Keccak-256 hash of the method signature
    const method = Buffer.from('claimAirdrop()', 'utf-8');
    const methodSignatureHash = keccak256(method);
    const methodSignature = methodSignatureHash.slice(0, 10).toString('hex');
    console.log(`Method signature: ${methodSignature}`);
    
    const url = `https://api.etherscan.io/api?module=logs&action=getLogs&address=${CONTRACT_ADDRESS}&topic0=0x${methodSignature}&apikey=${API_KEY}`;
    
    axios.get(url)
        .then(response => {
            const transactionCount = response.data.result.length;
            const airdropPerTransaction = 100000;
            const remainingAirdrops = airdropPerTransaction * transactionCount;
            
            const formattedCount = addCommasToBigInt(remainingAirdrops.toString());
            document.getElementById('airdropCount').innerText = formattedCount;
            console.log(`Airdrops Claimed: ${formattedCount}`);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

});
