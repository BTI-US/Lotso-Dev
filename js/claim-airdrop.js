import Web3 from 'web3';

let activeNetwork, contractAddress, webAddress, turnstileSiteKey;

try {
    // Attempt to load the configuration file
    const config = require('../contract-config.json');

    // Access properties
    activeNetwork = config.activeNetwork;
    contractAddress = config.contractAddress;
    webAddress = config.webAddress;
    turnstileSiteKey = config.turnstileSiteKey;

    // Additional validation can be performed here as needed
    if (!activeNetwork || !contractAddress || !webAddress || !turnstileSiteKey) {
        throw new Error("Required configuration values (activeNetwork or contractAddress or webAddress) are missing.");
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

async function initiateTransaction() {
    if (typeof window.ethereum !== 'undefined') {
        // MetaMask is installed
        const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.base.org'));

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
            const isGoerli = chainId === '0x14a33' && activeNetwork === 'baseGoerli';
            const isBase = chainId === '0x2105' && activeNetwork === 'base';

            if (isGoerli || isBase) {
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
                displayMessage(`Please switch to the ${activeNetwork === 'baseGoerli' ? 'Goerli Test Network' : 'Base Network'} in your MetaMask wallet.`, 'info');
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
    const fullAddress = document.getElementById('address').getAttribute('data-full-address');
    console.log('Checking eligibility for address:', fullAddress);

    const url = webAddress + `?address=${encodeURIComponent(fullAddress)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 0 && data.message === 'Success' && !data.error) {
                const txCount = data.data.transaction_count;
                const hasAirdropped = data.data.has_airdropped;
                const obtainedAddress = data.data.address;

                // Compare the obtained address with the sent address
                if (obtainedAddress.toLowerCase() !== fullAddress.toLowerCase()) {
                    throw new Error('The obtained address does not match the sent address');
                }

                if (txCount >= 10) {
                    if (!hasAirdropped) {
                        // User is eligible, but airdrop has not started
                        console.log('Airdrop has not started yet. Please wait patiently.');
                        displayMessage('Airdrop has not started yet. Please wait patiently.', 'info');
                    } else {
                        // User is eligible and airdrop is available
                        console.log('User is eligible to claim the airdrop');
                        document.getElementById('claimAirdrop').textContent = 'Claim Your Airdrop';
                    }
                } else {
                    // User is not eligible
                    displayMessage('You are not eligible to claim the airdrop', 'info');
                }
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            displayMessage(`Error: ${err.message}`, 'error');
        });
}

// Add event listener to the button
document.addEventListener('DOMContentLoaded', function () {
    const claimAirdropButton = document.getElementById('claimAirdrop');
    let isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Dynamically add Turnstile widget if not in a local environment
    if (!isLocal) {
        var script = document.createElement('script');
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        var widgetDiv = document.getElementById('turnstileWidget');
        var theme = document.getElementById('connectAccept').getAttribute('data-param');
        var turnstileElement = document.createElement('div');
        turnstileElement.className = 'cf-turnstile';
        turnstileElement.setAttribute('data-sitekey', turnstileSiteKey);
        turnstileElement.setAttribute('data-theme', theme);
        // Append the Turnstile element to the widget div
        widgetDiv.appendChild(turnstileElement);
    }

    if (claimAirdropButton) {
        claimAirdropButton.textContent = 'Check Your Account'; // Set initial button text

        claimAirdropButton.addEventListener('click', function handleButtonClick() {
            if (!isLocal) {
                var response = document.querySelector('[name="cf-turnstile-response"]').value;
                if (response) {
                    proceedWithAction(claimAirdropButton); // Proceed after CAPTCHA validation
                } else {
                    displayMessage('Please complete the CAPTCHA', 'error');
                }
            } else {
                console.log('Running locally, skipping CloudFlare Turnstile verification');
                proceedWithAction(claimAirdropButton); // Directly proceed as it's a local environment
            }
        });
    }
});

function proceedWithAction(button) {
    if (button.textContent === 'Check Your Account') {
        checkUserEligibility();
    } else if (button.textContent === 'Claim Your Airdrop') {
        initiateTransaction();
    }
}
