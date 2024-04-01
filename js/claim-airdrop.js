import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { base, baseSepolia, sepolia } from 'viem/chains';
import { reconnect, watchAccount, disconnect, getAccount, readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core';

// 1. Get a project ID at https://cloud.walletconnect.com
let projectId, activeNetwork, contractAddress, webAddress, turnstileSiteKey;

try {
    // Attempt to load the configuration file
    const jsonConfig = require('../contract-config.json');

    // Access properties
    activeNetwork = jsonConfig.activeNetwork;
    contractAddress = jsonConfig.contractAddress;
    webAddress = jsonConfig.webAddress;
    turnstileSiteKey = jsonConfig.turnstileSiteKey;
    projectId = jsonConfig.projectId;

    // Additional validation can be performed here as needed
    if (!activeNetwork || !contractAddress || !webAddress || !turnstileSiteKey || !projectId) {
        throw new Error("Required configuration values (activeNetwork or contractAddress or webAddress or turnstileSiteKey or projectId) are missing.");
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

// 2. Create wagmiConfig
const metadata = {
    name: 'Lotso',
    description: 'Web3Modal for Lotso',
    url: 'https://lotso.org', // origin must match your domain & subdomain.
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

let chains;

if (activeNetwork === 'baseMainnet') {
    chains = [base];
} else if (activeNetwork === 'baseSepolia') {
    chains = [baseSepolia];
} else if (activeNetwork === 'sepolia') {
    chains = [sepolia];
} else {
    console.log('Invalid network selection');
    process.exit(1);
}

export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
});
reconnect(config);
console.log("Wagmi Config is:" + config);

// 3. Create modal
const modal = createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
    themeVariables: {
        '--w3m-z-index': 999
    }
});

function connect(param = 'dark') {
    if (getAccount(config).isConnected) {
        disconnect(config);
    } else {
        modal.setThemeMode(param);
        modal.open();
    }
}

const connectBtn = document.getElementById('connectWallet');
const hint1 = document.getElementById('walletAddressHint1');
const hint2 = document.getElementById('walletAddressHint2');
const acceptBtn = document.getElementById('connectAccept');
const declineBtn = document.getElementById('connectDecline');
const connectTitle = document.getElementById('walletAddressTitle');
const airdrop = document.getElementById('airdrop');

if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
        // Get the responsive menu element
        var responsiveMenu = document.querySelector('.navbar-collapse');

        // Close the responsive menu if it's open
        if (responsiveMenu.classList.contains('show')) {
            responsiveMenu.classList.remove('show');
            responsiveMenu.setAttribute('aria-expanded', 'false');
        }

        // Get the data-param attribute and proceed with the connect function
        var param = this.getAttribute('data-param');
        connect(param);
    });
}

function escapeHtml(str) {
return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// listening for account changes
watchAccount(config,
    {
        onChange(account) {
            if (hint2) {
                let address = account.address ?? '';
                let truncatedAddress = address; // Adjust this if you want to show a truncated address

                let addressHtml = '<div class="address-container">';
                addressHtml += '<input id="address" type="text" value="' + escapeHtml(truncatedAddress) + '" readonly data-full-address="' + escapeHtml(address) + '">';
                addressHtml += '<button onclick="copyAddress(event)"><i class="fa fa-copy"></i></button>';
                addressHtml += '</div>';

                hint2.innerHTML = addressHtml;
            }
            if (acceptBtn) {
                if (account.isConnected) {
                    hint1.innerText = 'Your wallet address is:';
                    acceptBtn.innerText = 'Disconnect';
                    connectBtn.innerText = 'Airdrop';
                    connectTitle.innerText = 'Account Information';
                    declineBtn.innerText = 'Close';
                    airdrop.style.display = 'block';
                } else {
                    hint1.innerHTML = 'To continue, please connect your Web3 wallet, such as <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> or <a href="https://walletconnect.org/" target="_blank" rel="noopener noreferrer">WalletConnect</a>. This allows our website to securely interact with your wallet.';
                    hint2.innerHTML = 'By clicking "Accept and Continue", you agree to our <a href="#" data-toggle="modal" data-target="#termsModal">terms and conditions</a> and <a href="#" data-toggle="modal" data-target="#privacyModal">privacy policy</a>. You will be prompted to connect your wallet via an external link. Ensure you\'re using a trusted and secure wallet service.';
                    acceptBtn.innerText = 'Accept and Continue';
                    connectBtn.innerText = 'Airdrop';
                    connectTitle.innerText = 'Notes Before Connecting';
                    declineBtn.innerText = 'Decline';
                    airdrop.style.display = 'none';
                }
            }
        }
    }
);

async function initiateTransaction() {
    // Updated contract ABI to include getAirdropAmount function
    const airdropAcquireABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "getAirdropAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    displayMessage('Waiting for user confirmation', 'info');

    try {
        // Ensuring activeNetwork is valid
        if (!['baseSepolia', 'baseMainnet', 'sepolia'].includes(activeNetwork)) {
            console.log('Invalid network selection');
            displayMessage('Invalid network selection', 'error');
            return;
        }

        // Acquire full address from the DOM element
        const fullAddress = document.getElementById('address').getAttribute('data-full-address');

        const contractReadResult = await readContract(config, {
            abi: airdropAcquireABI,
            address: contractAddress, // Replace with your contract address
            functionName: 'getAirdropAmount',
            args: [fullAddress] // Use the fullAddress here
        });

        console.log('Airdrop Amount:', contractReadResult);
        displayMessage(`Your airdrop amount is: ${contractReadResult}, press the button above to confirm your airdrop.`, 'success');
        document.getElementById('claimAirdrop').textContent = 'Confirm Your Airdrop';
    } catch (error) {
        console.error('Unable to get the current chain ID:', error);
        displayMessage('Error in retrieving chain ID', 'error');
    }
}

async function confirmTransaction() {    
    // Contract ABI for claimAirdrop
    const airdropContractABI = [
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

    displayMessage('Processing airdrop claim...', 'info');

    try {
        const transactionResponse = await writeContract(config, {
            abi: airdropContractABI,
            address: contractAddress, // Your contract's address
            functionName: 'claimAirdrop',
            args: [] // If the function requires arguments, list them here
        });

        const txHash = transactionResponse;
        console.log('Transaction Hash:', txHash);
        displayMessage('Transaction sent. Waiting for confirmation...', 'info');

        // Wait for the transaction receipt
        const transactionReceipt = await waitForTransactionReceipt(config, { hash: txHash });

        console.log('Transaction Receipt:', transactionReceipt);
        if (transactionReceipt && transactionReceipt.status === 'success') {
            displayMessage('Transaction successful!', 'success');
        } else {
            displayMessage('Transaction failed', 'error');
        }
    } catch (error) {
        console.error('Error in transaction:', error);
        let errorMessage = error.reason || 'Error in claiming airdrop';
        displayMessage(errorMessage, 'error');
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
                const scheduledDelivery = new Date(data.data.scheduled_delivery);
                const now = new Date();

                // Compare the obtained address with the sent address
                if (obtainedAddress.toLowerCase() !== fullAddress.toLowerCase()) {
                    throw new Error('The obtained address does not match the sent address, please refresh the browser cache and retry.');
                }

                if (scheduledDelivery.toISOString() === "1970-01-01T08:00:00Z" || txCount <= 10) {
                    displayMessage('You do not have the eligibility to claim the airdrop', 'info');
                } else if (scheduledDelivery > now) {
                    // Calculate time difference and display countdown
                    let timeDiff = scheduledDelivery.getTime() - now.getTime();
                    let days = Math.floor(timeDiff / (1000 * 3600 * 24));
                    let hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
                    let minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
                    displayMessage(`Congratulations! You have been allocated 1,000,000 Lotso tokens for the airdrop. We have recorded your address and will distribute the airdrop to you in ${days} days, ${hours} hours, and ${minutes} minutes. You can come and claim the airdrop after we distribute it.`, 'info');
                } else {
                    if (!hasAirdropped) {
                        console.log('Airdrop has not started yet. Please wait patiently.');
                        displayMessage('Airdrop has not started yet. Please wait patiently.', 'info');
                    } else {
                        console.log('User is eligible to claim the airdrop');
                        displayMessage('You are eligible to claim the airdrop. Press the button above to check your airdrop amount.', 'info');
                        document.getElementById('claimAirdrop').textContent = 'Claim Your Airdrop';
                    }
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
    } else if (button.textContent === 'Confirm Your Airdrop') {
        confirmTransaction();
    }
}
