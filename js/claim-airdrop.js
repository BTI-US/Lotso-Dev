import Web3 from 'web3';

const infuraUrl = 'https://mainnet.infura.io/v3/8ec095d09ec74722a4157f133c97a41d';
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

async function initiateTransaction() {
    if (typeof window.ethereum !== 'undefined') {
        // MetaMask is installed
        const web3 = new Web3(window.ethereum);

        let activeNetwork, contractAddress;

        try {
            // Attempt to load the configuration file
            const config = require('../contract-config.json');

            // Access properties
            activeNetwork = config.activeNetwork;
            contractAddress = config.contractAddress;

            // Additional validation can be performed here as needed
            if (!activeNetwork || !contractAddress) {
                throw new Error("Required configuration values (activeNetwork or contractAddress) are missing.");
            }

            console.log('Active Network:', activeNetwork);
            console.log('Contract Address:', contractAddress);
        } catch (error) {
            // Check if the error is due to missing file
            if (error.code === 'MODULE_NOT_FOUND') {
                console.error("Error: Configuration file not found.");
                return; // Return or handle error as needed
            }

            // Handle other errors
            console.error("Error loading configuration: ", error.message);
            // Further error handling as needed
        }

        // Updated contract ABI
        const contractABI = [
            {
                "inputs": [],
                "name": "claimAirdrop",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];

        displayMessage('Waiting for user confirmation', 'info');

        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const isGoerli = chainId === '0x5' && activeNetwork === 'goerli';
            const isMainnet = chainId === '0x1' && activeNetwork === 'mainnet';

            if (isGoerli || isMainnet) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const contract = new web3.eth.Contract(contractABI, contractAddress);
                const userAccount = accounts[0];

                contract.methods.claimAirdrop().send({ from: userAccount })
                    .on('transactionHash', hash => {
                        console.log('Transaction Hash:', hash);
                        displayMessage('Transaction sent. Waiting for confirmation...', 'info');
                    })
                    .on('receipt', receipt => {
                        console.log('Transaction Receipt:', receipt);
                        displayMessage('Transaction successful!', 'success');
                    })
                    .catch(error => {
                        if (error.code === 4001) {
                            console.log('User denied transaction signature.');
                            displayMessage(error.message, 'info');
                        } else {
                            console.error('Transaction Error:', error);
                            displayMessage(error.message, 'error');
                        }
                    });
            } else {
                console.log('Incorrect network:', chainId);
                displayMessage(`Please switch to the ${activeNetwork === 'goerli' ? 'Goerli Test Network' : 'Ethereum Main Network'} in your MetaMask wallet.`, 'info');
            }
        } catch (error) {
            console.error('Unable to get the current chain ID:', error);
        }
    } else {
        console.log('MetaMask is not installed');
        displayMessage('MetaMask is not installed', 'error');
    }
}

function displayMessage(message, type) {
    // Log the message to the console
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Update an element in the HTML
    const messageElement = document.getElementById('airdropMessage');
    if (messageElement) {
        messageElement.innerText = message;
        // Clear previous class names
        messageElement.className = '';

        // Add the appropriate class based on the message type
        if (type === 'info') {
            messageElement.classList.add('success-message'); // Assuming info messages are success messages
        } else if (type === 'error') {
            messageElement.classList.add('error-message');
        }
    }
}

function checkUserEligibility() {
    const address = document.getElementById('address').getAttribute('data-full-address');
    web3.eth.getTransactionCount(address, (err, txCount) => {
        if (err) {
            console.error('Error fetching transaction count:', err);
            return;
        }
        if (txCount >= 10) { // Example criteria: user must have at least 10 transactions
            document.getElementById('claimAirdrop').textContent = 'Claim Your Airdrop';
        } else {
            displayMessage('You are not eligible to claim the airdrop', 'info');
        }
    });
}

// Add event listener to the button
document.addEventListener('DOMContentLoaded', function () {
    const claimAirdropButton = document.getElementById('claimAirdrop');
    if (claimAirdropButton) {
        claimAirdropButton.textContent = 'Check Your Account'; // Set initial button text

        claimAirdropButton.addEventListener('click', function handleButtonClick() {
            // Determine what action to take based on the current text of the button
            if (claimAirdropButton.textContent === 'Check Your Account') {
                checkUserEligibility();
            } else if (claimAirdropButton.textContent === 'Claim Your Airdrop') {
                initiateTransaction();
            }
        });
    }
});
