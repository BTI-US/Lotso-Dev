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
        CONTRACT_ADDRESS = jsonConfig.mainContractAddress;
    
        // Additional validation can be performed here as needed
        if (!API_KEY || !CONTRACT_ADDRESS) {
            throw new Error("Required configuration values (API_KEY or MAIN_CONTRACT_ADDRESS) are missing.");
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
    
    const url = `https://api.basescan.org/api?module=logs&action=getLogs&address=${CONTRACT_ADDRESS}&apikey=${API_KEY}`;
    
    axios.get(url)
        .then(response => {
            console.log(response.data);
            const transactions = response.data.result;
            const airdropPerTransaction = 100000;

            let successfulTransactions = 0;

            // Process each transaction
            console.log(`Number of transactions: ${transactions.length}`);
            const transactionPromises = transactions.map(tx => {
                const txHash = tx.transactionHash;
                const txReceiptUrl = `https://api.basescan.org/api?module=transaction&action=getstatus&txhash=${txHash}&apikey=${API_KEY}`;
                return axios.get(txReceiptUrl)
                    .then(receiptResponse => {
                        console.log(`Transaction ${txHash}: isError = ${receiptResponse.data.result.isError}`);
                        if (receiptResponse.data.result.isError === '0') {
                            successfulTransactions++;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching transaction receipt:', error);
                    });
            });

            // After all transactions have been processed
            Promise.all(transactionPromises).then(() => {
                const airdropsClaimed = airdropPerTransaction * successfulTransactions;

                const formattedCount = addCommasToBigInt(airdropsClaimed.toString());
                document.getElementById('airdropCount').innerText = formattedCount;
                console.log(`Airdrops Claimed: ${formattedCount}`);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

});
